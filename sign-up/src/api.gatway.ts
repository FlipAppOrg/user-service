// api-gateway.ts
import express from 'express';
import { userRegistrationRouter } from '../src/user-registration/user.registration.service';
import { userProfileRouter } from '../src/user-profile/user.profile.service';
import { communicationRouter } from '../src/communication/communication.service';

const app = express();
app.use(express.json());

// Routes to different microservices
app.use('/user-registration', userRegistrationRouter);
app.use('/user-profile', userProfileRouter);
app.use('/communication', communicationRouter);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
});
