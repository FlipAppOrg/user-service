const { Model, DataTypes } = require('sequelize');
const sequelize = require('./index');

class UserProfile extends Model {}

UserProfile.init({
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        }
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'userProfile',
});

module.exports = UserProfile;
