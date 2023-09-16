import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { User } from '../interfaces/users.interface';
import { compare } from 'bcryptjs';
import _ from 'lodash';

export type UserCreationAttributes = Optional<User, 'id' | 'email' | 'password'>;

export class UserModel extends Model<User, UserCreationAttributes> implements User {
  id?: number;
  email: string;
  password?: string;
  emailOtp?: string;
  phoneOtp?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  userRole: number;
  phone?: string;
  name: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public comparePassword = async (inputPass: string) => {
    await this.reload({
      attributes: {
        include: ['password'],
      },
    });
    return await compare(inputPass, this.getDataValue('password'));
  };

  public compareEmailOtp = (otpInput: string) => {
    console.log(otpInput, this.getDataValue('emailOtp'));
    return otpInput === this.getDataValue('emailOtp');
  };

  public comparePhoneOtp = (otpInput: string) => {
    return otpInput === this.getDataValue('phoneOtp');
  };

  public getPublicData() {
    return _.omit(this.get(), ['password', 'emailOtp', 'phoneOtp']);
  }
}

export default function (sequelize: Sequelize): typeof UserModel {
  UserModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      name: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },
      password: {
        allowNull: true,
        type: DataTypes.STRING(255),
      },
      emailOtp: {
        allowNull: true,
        type: DataTypes.STRING(10),
      },
      phoneOtp: {
        allowNull: true,
        type: DataTypes.STRING(10),
      },
      isEmailVerified: {
        allowNull: false,
        type: DataTypes.BOOLEAN(),
        defaultValue: false,
      },
      isPhoneVerified: {
        allowNull: false,
        type: DataTypes.BOOLEAN(),
        defaultValue: false,
      },
      phone: {
        allowNull: true,
        type: DataTypes.STRING(15),
      },
      userRole: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 5,
      },
    },
    {
      tableName: 'user',
      sequelize,
      defaultScope: {
        attributes: {
          exclude: ['password', 'emailOtp', 'phoneOtp'],
        },
      },
    }
  );

  return UserModel;
}
