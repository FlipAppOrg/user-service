// utils.ts
import { Twilio } from 'twilio';

// Replace with your Twilio account SID and authentication token
export const TWILIO_ACCOUNT_SID = 'ACfbc093e2c98187fa4d147f2b0a268b28';
export const TWILIO_AUTH_TOKEN = '0b12294273b423d7d1f158ef52cd5401';
export const TWILIO_PHONE_NUMBER = 'your_twilio_phone_number';

// Create a Twilio client
const twilioClient = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Function to generate a random OTP (for example, a 6-digit number)
export function generateOTP(): string {
  const otpLength = 6;
  const min = Math.pow(10, otpLength - 1);
  const max = Math.pow(10, otpLength) - 1;
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

// Function to send OTP SMS using Twilio
export async function sendOtpSMS(mobileNumber: string, otp: string): Promise<void> {
  try {
    const message = await twilioClient.messages.create({
      body: `Your OTP code is ${otp}`,
      from: TWILIO_PHONE_NUMBER,
      to: mobileNumber,
    });

    console.log(`OTP sent to ${message.to}: ${message.sid}`);
  } catch (error) {
    console.error(`Error sending OTP: ${error.message}`);
    throw error;
  }
}


