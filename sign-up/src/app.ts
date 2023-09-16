// app.ts
import express, { Request, Response } from 'express';
import { Sequelize, Model, DataTypes } from 'sequelize';
import { createUser, verifyMobileNumber, userRegistrationRouter } from '../src/user-registration/user.registration.controller';

const app = express();
const port = process.env.PORT || 3000;

// Sequelize database configuration
const sequelize = new Sequelize('your_database_name', 'your_database_username', 'your_database_password', {
  host: 'localhost', // Change this to your database host
  dialect: 'mysql', // Use 'mysql' if you're using MySQL
  logging: false, // Disable Sequelize's SQL logging for production
});

// Import and initialize the User model
import User from '../src/models/user.model';
new User(sequelize);

// Middleware for parsing JSON request bodies
app.use(express.json());

// Routes for user registration
app.use('/user-registration', userRegistrationRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
