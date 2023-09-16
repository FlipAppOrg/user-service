// models/user.ts
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database'; // Import the sequelize instance

class User extends Model {
  public id!: number;
  public mobileNumber!: string;
  public password!: string;
  public otp!: string;
  public isMobileVerified!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    mobileNumber: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: DataTypes.STRING,
    otp: DataTypes.STRING,
    isMobileVerified: DataTypes.BOOLEAN,
  },
  {
    sequelize, // Use the imported sequelize instance here
    modelName: 'User',
  }
);

export default User;
