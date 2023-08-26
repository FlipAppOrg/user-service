const { User } = require('../models');

function generateOTP(length = 6) {
    return Math.floor(10 ** (length - 1) + Math.random() * 9 * 10 ** (length - 1)).toString();
}

async function sendOTP(userId, method) {
    const otp = generateOTP();
    const now = new Date();
    const expiration = new Date(now.getTime() + 15*60000); // OTP valid for 15 minutes

    await User.update({ otpCode: otp, otpExpiration: expiration }, { where: { id: userId } });

    // Based on method, dispatch the OTP
    switch(method) {
        case 'sms':
            // sendSMS(userPhoneNumber, otp);
            break;
        case 'whatsapp':
            // sendWhatsApp(userPhoneNumber, otp);
            break;
        case 'telegram':
            // sendTelegram(userTelegramId, otp);
            break;
        case 'email':
            // sendEmail(userEmail, `Your OTP is: ${otp}`);
            break;
    }
}

async function verifyOTP(userId, otp) {
    const user = await User.findByPk(userId);
    if(!user) return false;

    const now = new Date();

    if(user.otpCode === otp && user.otpExpiration > now) {
        // You can nullify the otpCode and otpExpiration if you want
        return true;
    }

    return false;
}

module.exports = {
    sendOTP,
    verifyOTP,
};
