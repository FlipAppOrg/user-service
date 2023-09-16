// database.ts
import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('your_database_name', 'your_username', 'your_password', {
  host: 'localhost', // Change to your database host
  dialect: 'mysql', // Change to your database dialect if necessary
});

// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
