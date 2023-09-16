import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { KYC } from '../interfaces/kyc.interface';

export type KYCCreationAttributes = Optional<KYC, 'id'>;

export class KYCModel extends Model<KYC, KYCCreationAttributes> implements KYC {
  id?: number;
  personalId: string;
  captureDetails: boolean;
  confirmDetails: boolean;
  emiratesId: string;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function (sequelize: Sequelize): typeof KYCModel {
  KYCModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      personalId: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      captureDetails: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      confirmDetails: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      emiratesId: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: 'kyc',
      sequelize,
    }
  );

  return KYCModel;
}
