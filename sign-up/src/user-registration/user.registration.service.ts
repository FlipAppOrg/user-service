// user-registration-service.ts

import express from 'express';
import { createUser, verifyMobileNumber } from '../user-registration/user.registration.controller';

const app = express();
app.use(express.json());

const router = express.Router(); // Create an Express router

// Endpoint to create a new user
router.post('/signup', createUser);

// Endpoint to verify mobile number using OTP
router.post('/verify-mobile', verifyMobileNumber);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`User Registration Service is running on port ${PORT}`);
});

export { router as userRegistrationRouter }; // Export the router as userRegistrationRouter
