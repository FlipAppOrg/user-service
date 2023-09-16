// card.model.ts
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Card } from '../interfaces/card.interface';

export type CardCreationAttributes = Optional<Card, 'id'>;

export class CardModel extends Model<Card, CardCreationAttributes> implements Card {
  id: number;
  cardNumber: string;
  expiry: string;
  cvv: string;
  userId: number;
  createdAt: Date; // Ensure that createdAt is required
  updatedAt: Date;
}

export default function (sequelize: Sequelize): typeof CardModel {
  CardModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      cardNumber: {
        type: DataTypes.STRING(16), // Adjust the length as needed
        allowNull: false,
      },
      expiry: {
        type: DataTypes.STRING(5), // Adjust the length as needed
        allowNull: false,
      },
      cvv: {
        type: DataTypes.STRING(3), // Adjust the length as needed
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE, // Adjust the data type as needed
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: DataTypes.DATE, // Adjust the data type as needed
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      tableName: 'card',
      sequelize,
    }
  );

  return CardModel;
}
