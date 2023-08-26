const { KYCData } = require('../models');

async function requireKYCVerification(req, res, next) {
    const { userId } = req.body;

    const kycData = await KYCData.findOne({ where: { userId } });
    
    if(!kycData || kycData.verificationStatus !== 'VERIFIED') {
        return res.status(403).send('You must have verified KYC to perform this operation.');
    }

    next();
}

module.exports = requireKYCVerification;