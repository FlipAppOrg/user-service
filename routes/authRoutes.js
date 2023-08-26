const express = require('express');
const { sendMagicLink, verifyMagicLink } = require('../services/authService');
const { sendOTP, verifyOTP } = require('../services/otpService');

const router = express.Router();

router.post('/requestMagicLink', async (req, res) => {
    try {
        await sendMagicLink(req.body.email);
        res.status(200).send('Magic link sent to your email.');
    } catch (error) {
        res.status(500).send('Server error.');
    }
});

router.get('/loginWithMagicLink', async (req, res) => {
    try {
        const user = await verifyMagicLink(req.query.token);
        if (!user) return res.status(400).send('Invalid magic link or user not found.');
        // TODO: Handle user login, set session or JWT.
        res.status(200).send('Logged in successfully.');
    } catch (error) {
        res.status(500).send('Server error.');
    }
});

router.post('/requestOTP', async (req, res) => {
    try {
        const { userId, method } = req.body; // method can be 'sms', 'whatsapp', 'telegram', or 'email'
        await sendOTP(userId, method);
        res.status(200).send(`OTP sent via ${method}.`);
    } catch (error) {
        res.status(500).send('Server error.');
    }
});

router.post('/loginWithOTP', async (req, res) => {
    try {
        const { userId, otp } = req.body;
        const isValid = await verifyOTP(userId, otp);
        if (!isValid) return res.status(400).send('Invalid OTP.');

        // Handle user login here, set session or JWT.
        res.status(200).send('Logged in successfully.');
    } catch (error) {
        res.status(500).send('Server error.');
    }
});

module.exports = router;
