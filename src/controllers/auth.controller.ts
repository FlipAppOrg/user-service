import { NextFunction, Request, Response } from 'express';
import { CreateUserDto, LoginUserDto, VerifyLoginUserDto } from '../dtos/users.dto';
import { User } from '../interfaces/users.interface';
import { ApiResponse, ResponseStatus, createApiResponse } from '../dtos/apiresponse.dtos';
import { DataStoredInToken, RequestWithUser } from '../interfaces/auth.interface';
import { AuthService } from '../services';
import _ from 'lodash';
import { logger } from '../utils/logger';
import { UserSvcException } from '../exceptions/httpException';
import { create } from 'domain';

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData: CreateUserDto = req.body;
    // await AuthService.signup(userData);
    
    let data = await  AuthService.signup(userData);
    console.log('signup response: ', data);
    res.status(201).json(createApiResponse(ResponseStatus.success, data));
  } catch (error) {
    console.log(error);
    if (error instanceof UserSvcException){
      res.status(error.status).json(createApiResponse(ResponseStatus.error, null, error.message));
    }
    next(error);
  }
};

export const logIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData: LoginUserDto = req.body;
    await AuthService.login(userData);
    res.status(200).json(createApiResponse(ResponseStatus.success, { success: true, message: 'OTP sent' }));
  } catch (error) {
    if (error instanceof UserSvcException){
      res.status(error.status).json(createApiResponse(ResponseStatus.error, null, error.message));
    }
    next(error);
  }
};

export const adminSignUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData: CreateUserDto = req.body;
    const { createUserData: signUpUserData, accessToken, refreshToken } = await AuthService.adminSignup(userData);
    const accessTokencookie = AuthService.createCookie('access_token', accessToken);
    const refreshTokenCookie = AuthService.createCookie('refresh_token', refreshToken);
    res.setHeader('Set-Cookie', [accessTokencookie, refreshTokenCookie]);
    res.status(201).json({
      data: { userRole: _.pick(signUpUserData, ['id', 'userRole', 'isEmailVerified', 'isPhoneVerified', 'device']), accessToken, refreshToken },
      message: 'signup',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const adminLogIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData: LoginUserDto = req.body;
    const result = await AuthService.adminLogin(userData);
    res.status(200).json({
      success: true,
      data: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData: VerifyLoginUserDto = req.body;
    const result = await AuthService.verifyLogin(userData);
    const accessTokencookie = AuthService.createCookie('access_token', result.accessToken);
    const refreshTokenCookie = AuthService.createCookie('refresh_token', result.refreshToken);
    res.setHeader('Set-Cookie', [accessTokencookie, refreshTokenCookie]);
    res.status(200).json(createApiResponse(ResponseStatus.success,{
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    }));
  } catch (error) {
    console.log(error);
    if (error instanceof UserSvcException){
      res.status(error.status).json(createApiResponse(ResponseStatus.error, null, error.message));
    }
    next(error);
  }
};

export const verifySignUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const signUpData: VerifyLoginUserDto = req.body;
    const result = await AuthService.verifySignUp(signUpData);
    res.status(200).json(createApiResponse(ResponseStatus.success, {
      success: true,
      message: 'Successfully registered for Trapaaca waiting list',
    }));
  } catch (error) {
    console.log(error);
    if (error instanceof UserSvcException){
      res.status(error.status).json(createApiResponse(ResponseStatus.error, null, error.message));
    }
    next(error);
  }
};

export const logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const userData: User = req.user;
    const logOutUserData: User = await AuthService.logout(userData);
    res.setHeader('Set-Cookie', ['access_token=; Max-age=0', 'refresh_token=; Max-age=0']);
    res.status(200).json({ data: logOutUserData, message: 'logout' });
  } catch (error) {
    next(error);
  }
};

export const sendSmsOtp = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const userData: User = req.user;
    await AuthService.sendOtpSMS(userData);
    res.status(200).json({ success: true, message: `Sent an OTP SMS to ${userData.phone}` });
  } catch (error) {
    next(error);
  }
};

export const sendEmailOtp = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const userData: User = req.user;
    await AuthService.sendOtpEmail(userData);
    res.status(200).json({ success: true, message: `Sent an OTP email to ${userData.email}` });
  } catch (error) {
    next(error);
  }
};

export const verifySmsOtp = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const userData = req.user as DataStoredInToken;
    const otp = req.body.otp;
    const result = await AuthService.verifyOtpPublic(userData, otp, 'phone');
    res.status(200).json({ success: true, data: { isVerified: result } });
  } catch (error) {
    next(error);
  }
};

export const verifyEmailOtp = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const userData = req.user as DataStoredInToken;
    const otp = req.body.otp;
    const result = await AuthService.verifyOtpPublic(userData, otp, 'email');
    res.status(200).json({ success: true, data: { isVerified: result } });
  } catch (error) {
    next(error);
  }
};

export const authCheck = async (req: RequestWithUser, res: Response) => {
  res.json(req.user);
};

export const regenerateOtp = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    await AuthService.sendRegenerateOtpEmail(req.body.email);
    res.status(200).json({ success: true, message: `OTP sent to the email ${req.body.email}` });
  } catch (error) {
    next(error);
  }
};
