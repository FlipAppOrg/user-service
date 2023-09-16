import { UserSvcException } from '../exceptions/httpException';
import { UserModel } from '../models/users.model';
import { logger } from '../utils/logger';
import { generateOTP, genrateRandomNumber } from '../utils/math';
import { SECRET_KEY } from '../config';
import { DB } from '../database';
import { CreateUserDto, LoginUserDto } from '../dtos/users.dto';
import { DataStoredInToken, TokenData } from '../interfaces/auth.interface';
import { User } from '../interfaces/users.interface';
import axios from 'axios';
import { hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import SmsClient from 'twilio';

// Define a new flag to track signup completion
let signupComplete = false;

export const createAccessToken = (userModel: UserModel): TokenData => {
  const user = userModel.dataValues;

  const dataStoredInToken: DataStoredInToken = { id: user.id, email: user.email };
  const expiresIn: number = 60 * 60 * 6;

  return { expiresIn, token: sign(dataStoredInToken, SECRET_KEY, { expiresIn }) };
};

export const createRefreshToken = (userModel: UserModel): TokenData => {
  const user = userModel.dataValues;

  const dataStoredInToken: DataStoredInToken = { id: user.id };
  const expiresIn = '1y';

  return { expiresIn, token: sign(dataStoredInToken, SECRET_KEY, { expiresIn }) };
};

export const createCookie = (cookieName: string, tokenData: TokenData): string => {
  return `${cookieName}=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
};

export async function signup(userData: CreateUserDto) {
  const findUser: User = await DB.User.findOne({ where: { email: userData.email } });
  if (findUser) throw new UserSvcException(409, `This email ${userData.email} already exists`);

  const createUserData: UserModel = await DB.User.create({ ...userData });

  // Generate and send OTP to the provided mobile number
  let otp: string = await sendOtpSMS(createUserData.dataValues);

  // Set the signupComplete flag to false as it's only the first step
  signupComplete = false;

  return { message: 'OTP sent to mobile number', 'signupComplete': signupComplete, 'otp': otp };
}

export async function login(userData: LoginUserDto): Promise<boolean> {
  const findUser = await DB.User.findOne({ where: { email: userData.email } });
  if (!findUser) throw new UserSvcException(404, `This email ${userData.email} was not found`);
  return await sendOtpEmail(findUser.dataValues, false);
}

export async function adminSignup(userData: CreateUserDto) {
  const findUser: User = await DB.User.findOne({ where: { email: userData.email } });
  if (findUser) throw new UserSvcException(409, `This email ${userData.email} already exists`);
  const hashedPassword = await hash(userData.password, 10);
  const createUserData: UserModel = await DB.User.create({ ...userData, password: hashedPassword, userRole: 1 });
  await sendOtpEmail(createUserData);

  const accessToken = createAccessToken(createUserData);
  const refreshToken = createRefreshToken(createUserData);

  return { createUserData: createUserData.get(), accessToken, refreshToken };
}

export async function adminLogin(userData: LoginUserDto) {
  const findUser = await DB.User.findOne({ where: { email: userData.email } });
  if (!findUser) throw new UserSvcException(404, `This email ${userData.email} was not found`);

  const res = await findUser.comparePassword(userData.password);
  if (!res) throw new UserSvcException(403, `Incorrect Password`);

  const accessToken = createAccessToken(findUser);
  const refreshToken = createRefreshToken(findUser);

  return { accessToken, refreshToken, findUser: findUser.getPublicData() };
}

export async function verifyLogin(loginData: { email: string; otp: string }) {
  const findUser = await DB.User.findOne({ attributes: { include: ['emailOtp'] }, where: { email: loginData.email } });
  if (!findUser) throw new UserSvcException(404, `This email ${loginData.email} was not found`);
  const result = await verifyOtp(findUser, loginData.otp, 'email');

  if (result) {
    findUser.update({ isEmailVerified: true });
    const accessToken = createAccessToken(findUser);
    const refreshToken = createRefreshToken(findUser);

    return { accessToken, refreshToken, findUser: findUser.getPublicData() };
  } else {
    throw new UserSvcException(400, `Invalid otp`);
  }
}

export async function verifySignUp(signUpData: { email: string; otp: string }) {
  const findUser = await DB.User.findOne({ attributes: { include: ['emailOtp'] }, where: { email: signUpData.email } });
  if (!findUser) throw new UserSvcException(404, `This email ${signUpData.email} was not found`);
  const result = await verifyOtp(findUser, signUpData.otp, 'email');

  if (result) {
    findUser.update({ isEmailVerified: true });
    return { message: 'Email verification successful', user: findUser.getPublicData() };
  } else {
    throw new UserSvcException(400, `Invalid OTP`);
  }
}

export async function logout(userData: User): Promise<User> {
  const findUser: User = await DB.User.findOne({ where: { email: userData.email, password: userData.password } });
  if (!findUser) throw new UserSvcException(404, "User doesn't exist");

  return findUser;
}

export async function sendOtpSMS(userData: User): Promise<string> {
  const TWILIO_SID = process.env.TWILIO_SID;
  const TWILIO_AUTH = process.env.TWILIO_AUTH;
  const otp = generateOTP();
  if (process.env.ENV === 'test'){
    console.log('**********  testing the otp **************8 : ' + otp);
    return otp; 
  } else {
    const client = SmsClient(TWILIO_SID, TWILIO_AUTH);
  
    await client.messages.create({ body: `Your OTP code is ${otp}`, from: '+15076094642', to: userData.phone });
    await DB.User.update({ phoneOtp: otp }, { where: { id: userData.id } });
    return 'otp sent';
  }
  
}

export async function sendOtpEmail(userData: User | UserModel, isSignUp: boolean): Promise<any> {
  if (userData instanceof UserModel) userData = userData.dataValues;
  const otp = generateOTP();
  if (otp) {
    await DB.User.update({ emailOtp: otp }, { where: { email: userData.email } });
  }
  let data;
  if (isSignUp) {
    data = {
      email: userData.email,
      otp: otp,
      subject: "Registration Completed",
      body: `
      
          <p>Hello ${userData.name},</p>
          <p><strong>OTP: ${otp}</strong></p>
       
      `
    };
  } else {
    data = {
      email: userData.email,
      otp: otp,
      subject: "OTP for Sign In",
      body: `
     
          <p>Hello ${userData.name},</p>
          <p><strong>OTP: ${otp}</strong></p>
      
      `
    };
  }
  const config = {
    method: 'POST',
    maxBodyLength: Infinity,
    url: '=',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };

  try {
    const result = await axios.post(config.url, data);
    console.log('email response: ', result.status);
    console.log('email response: ', result.data);
  } catch (ex) {
    logger.error(ex);
  } finally {
    await DB.User.update({ emailOtp: otp }, { where: { id: userData.id } });
  }
}

export async function verifyOtp(userData: UserModel, receivedOtp: string, type: 'email' | 'phone') {
  logger.warn(JSON.stringify({ userData, receivedOtp, }));
  console.warn(userData);
  switch (type) {
    case 'email':
      console.warn(type, userData.compareEmailOtp(receivedOtp));
      if (userData.compareEmailOtp(receivedOtp)) {
        console.warn(type, userData.compareEmailOtp(receivedOtp));

        return await DB.User.update({ isEmailVerified: true }, { where: { id: userData.dataValues.id } });
      }
      break;
    case 'phone':
      console.warn(type);
      if (userData.comparePhoneOtp(receivedOtp)) {
        console.warn(type);

        return await DB.User.update({ isPhoneVerified: true }, { where: { id: userData.dataValues.id } });
      }
      break;
    default:
      return false;
      break;
  }
}

export async function verifyOtpPublic(userData: DataStoredInToken, receivedOtp: string, type: 'email' | 'phone') {
  const findUser = await DB.User.findOne({ attributes: { include: ['emailOtp'] }, where: { id: userData.id } });
  return verifyOtp(findUser, receivedOtp, type);
}

let lastOtpGenerationTime = null; // Track the last OTP generation time

export async function sendRegenerateOtpEmail(email): Promise<any> {
  const currentTime = Date.now();
  const timeDiff = lastOtpGenerationTime ? currentTime - lastOtpGenerationTime : Infinity;

  if (timeDiff >= 2 * 60 * 1000) {
    const otp = generateOTP();
    let data;
    data = {
      email: email,
      subject: "OTP for Sign In",
      body: `
   
        <p><strong>OTP: ${otp}</strong></p>
   
      `
    };

    const config = {
      method: 'POST',
      maxBodyLength: Infinity,
      url: '',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    try {
      const result = await axios.post(config.url, data);
      lastOtpGenerationTime = currentTime; // Update the last OTP generation time
    } catch (ex) {
      logger.error(ex);
      throw new Error('Failed to send OTP email');
    } finally {
      try {
        await DB.User.update({ emailOtp: otp }, { where: { email: email } });
        const response = `OTP sent to the email ${email}`;
        return response; // Return the success response
      } catch (error) {
        // Handle error when updating the user
        logger.error(error);
        throw new Error('Failed to update user');
      }
    }
  } else {
    const remainingTime = Math.ceil((2 * 60 * 1000 - timeDiff) / 1000); // Calculate remaining time in seconds
    const response = `Please wait ${remainingTime} seconds before requesting a new OTP.`;
    return response; // Return the response
  }
}

export async function getUserRole(email) {
  try {
    const findUser = await DB.User.findOne({ where: { email: email } });
    if (!findUser) {
      throw new Error('User not found');
    }
    return findUser.dataValues.userRole;
  } catch (error) {
    console.error('Error in getUserRole:', error.message);
    throw error; // Re-throw the error to be handled by the caller
  }
}

export function saveProfileDetails(userData: CreateUserDto) {
  throw new Error('Function not implemented.');
}
