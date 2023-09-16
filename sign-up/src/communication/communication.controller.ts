import express from 'express';
import { Twilio } from 'twilio'; // Import Twilio
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } from '../utils'; // Import Twilio configuration

const router = express.Router();

// Initialize the Twilio client
const twilioClient = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Function to send OTP via SMS
const sendOtpSMS = async (req: express.Request, res: express.Response) => {
  try {
    const { mobileNumber, otp } = req.body;

    // Implement sending SMS using Twilio
    await twilioClient.messages.create({
      body: `Your OTP code is ${otp}`,
      from: TWILIO_PHONE_NUMBER,
      to: mobileNumber,
    });

    return res.status(200).json({ message: 'OTP sent via SMS' });
  } catch (error) {
    console.error('Error sending OTP via SMS:', error.message);
    return res.status(500).json({ message: 'Failed to send OTP via SMS' });
  }
};

export { router as communicationRouter, sendOtpSMS };
