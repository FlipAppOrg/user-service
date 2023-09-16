// kyc.controller.ts
import { Request, Response } from 'express';
import { KYCCreateDto } from '../dtos/kyc.dtos';
import { KYCService } from '../services/kyc.service';

export const createKYC = async (req: Request, res: Response) => {
  try {
    const kycData: KYCCreateDto = req.body;
    // Save KYC data to the database
    await KYCService.createKYCDetails(kycData);
    // Send response
    res.status(201).json({ success: true, message: 'KYC data saved successfully' });
  } catch (error) {
    // Handle errors
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};