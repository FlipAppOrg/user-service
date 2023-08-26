const { Model, DataTypes } = require('sequelize');
const sequelize = require('./index');

class KYCData extends Model {}

KYCData.init({
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        }
    },
    identificationPath: { 
        type: DataTypes.STRING,
    },
    verificationStatus: { 
        type: DataTypes.ENUM('PENDING', 'VERIFIED', 'REJECTED'),
        defaultValue: 'PENDING',
    },
}, {
    sequelize,
    modelName: 'kycData',
});

module.exports = KYCData;
