// user-profile-service.ts
import express from 'express';
import { userProfileRouter } from '../user-profile/user.profile.controller'; // Ensure the import path is correct

const app = express();
app.use(express.json());

// Mount the user profile router
app.use('/user-profile', userProfileRouter); // Use an appropriate path for mounting the router

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`User Profile Service is running on port ${PORT}`);
});
export { userProfileRouter };

