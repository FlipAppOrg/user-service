// communication.service.ts
import express from 'express';
import { communicationRouter } from './communication.controller'; // Adjust the import path

const app = express();
app.use(express.json());

// Mount the communication router
app.use('/communication', communicationRouter); // Use an appropriate path for mounting the router

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Communication Service is running on port ${PORT}`);
});
export { communicationRouter };

