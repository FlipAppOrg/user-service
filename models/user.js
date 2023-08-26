const { Model, DataTypes } = require('sequelize');
const sequelize = require('./index');

class User extends Model {}

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    profileData: {
        type: DataTypes.JSONB,
    },
    isTwoFactorAuthEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    twoFactorAuthCode: {
        type: DataTypes.STRING,
    },
    lastLogin: {
        type: DataTypes.DATE,
    },
}, {
    sequelize,
    modelName: 'user',
});

module.exports = User;
