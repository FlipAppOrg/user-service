const { User } = require('../models');
const speakeasy = require('speakeasy');

async function enable2FA(userId) {
    const secret = speakeasy.generateSecret({ length: 20 });
    await User.update({ twoFactorAuthCode: secret.base32 }, { where: { id: userId } });
    return secret;
}

async function verify2FA(userId, token) {
    const user = await User.findByPk(userId);
    return speakeasy.totp.verify({
        secret: user.twoFactorAuthCode,
        encoding: 'base32',
        token,
    });
}

module.exports = {
    enable2FA,
    verify2FA,
};
