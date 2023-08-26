const express = require('express');
const { enable2FA, verify2FA } = require('../services/userService');
const { UserProfile, KYCData } = require('../models');

const router = express.Router();

router.post('/enable2FA', async (req, res) => {
    try {
        const secret = await enable2FA(req.user.id);  // Assume req.user.id contains the authenticated user's ID
        res.json(secret);  // NOTE: This should only be shared once with the user.
    } catch (error) {
        res.status(500).send('Server error.');
    }
});

router.post('/verify2FA', async (req, res) => {
    try {
        const isValid = await verify2FA(req.user.id, req.body.token);
        if (!isValid) return res.status(400).send('Invalid 2FA token.');
        res.status(200).send('2FA verification successful.');
    } catch (error) {
        res.status(500).send('Server error.');
    }
});

router.post('/submitProfile', async (req, res) => {
    try {
        const { userId, fullName, dateOfBirth, address } = req.body;
        await UserProfile.create({ userId, fullName, dateOfBirth, address });
        res.status(200).send('Profile information submitted successfully.');
    } catch (error) {
        res.status(500).send('Server error.');
    }
});

router.post('/submitKYC', async (req, res) => {
    try {
        const { userId, identificationFile } = req.body;

        const identificationPath = await saveKYCFileSecurely(identificationFile);
        await KYCData.create({ userId, identificationPath });

        res.status(200).send('KYC document submitted. It is under review.');
    } catch (error) {
        res.status(500).send('Server error.');
    }
});

module.exports = router;
