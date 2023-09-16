// user-registration-controller.ts
import { Request, Response, Router } from 'express';
import { generateOTP, sendOtpSMS } from '../utils'; // Implement sendOtpSMS function
import User from '../models/user.model'; // Import the Sequelize User model

const router = Router();

// Function to create a new user
export const createUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { mobileNumber, password } = req.body;

    // Check if the user already exists in the database
    const existingUser = await User.findOne({ where: { mobileNumber } });
    if (existingUser) {
      return res.status(409).json({ message: 'Mobile number already exists' });
    }

    // Generate OTP and send it to the mobile number
    const otp = generateOTP();
    sendOtpSMS(mobileNumber, otp); // Implement sendOtpSMS function to send SMS

    // Create a new user in the database
    await User.create({ mobileNumber, password, otp, isMobileVerified: false });

    return res.status(201).json({ message: 'OTP sent to mobile number' });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ message: 'Failed to create user' });
  }
};

// Function to verify mobile number using OTP
export const verifyMobileNumber = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { mobileNumber, otp } = req.body;

    // Find the user in the database
    const user = await User.findOne({ where: { mobileNumber } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Update the user's mobile verification status in the database
    await user.update({ isMobileVerified: true });

    return res.status(200).json({ message: 'Mobile number verified successfully' });
  } catch (error) {
    console.error('Error verifying mobile number:', error);
    return res.status(500).json({ message: 'Failed to verify mobile number' });
  }
};

// Export the router
export { router as userRegistrationRouter };
