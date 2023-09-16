// user-profile-controller.ts
import express, { Request, Response } from 'express';

const router = express.Router();

// In-memory storage for user profile data (replace with a real database)
const userProfileData: { [key: string]: any } = {};

// Function to update user profile information
export function updateUserProfile(req: Request, res: Response): Response {
  const { userId } = req.params;
  const { name, country, email } = req.body;

  // Check if the user exists in the user profile data
  if (!userProfileData[userId]) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Update user profile information
  userProfileData[userId] = { name, country, email };

  return res.status(200).json({ message: 'User profile updated successfully' });
}

// Export the router
export { router as userProfileRouter };
