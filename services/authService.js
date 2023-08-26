const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { sendEmail } = require('./emailService');

async function sendMagicLink(email) {
    const user = await User.findOne({ where: { email } });

    if (!user) throw new Error('User not found.');

    const token = jwt.sign({ id: user.id }, 'YOUR_SECRET_KEY', { expiresIn: '15m' });

    sendEmail(email, `http://yourapp.com/loginWithMagicLink?token=${token}`);
}

async function verifyMagicLink(token) {
    const decoded = jwt.verify(token, 'YOUR_SECRET_KEY');
    return await User.findByPk(decoded.id);
}

module.exports = {
    sendMagicLink,
    verifyMagicLink,
};
