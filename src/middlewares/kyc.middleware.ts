import { Request, Response, NextFunction } from 'express';
import { KYCCreateDto } from '../dtos/kyc.dtos';
import { KYCService } from '../services/kyc.service';
import { UserService } from '@/services';
import { RequestWithUser } from '@/interfaces/auth.interface';

export async function captureEmiratesIdMiddleware(req: RequestWithUser, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id; // Now TypeScript recognizes the user property
    const emiratesId: string = req.body.emiratesId; // Assuming the ID is sent in the request body

    // Create KYC record
    const kycData: KYCCreateDto = {
        emiratesId,
        userId,
        personalId: '',
        captureDetails: false,
        confirmDetails: false
    };

    const kycDetails = await KYCService.createKYCDetails(kycData);

    // Update user's KYC status
    await UserService.updateKYCStatus(userId, true);

    res.status(201).json({ success: true, message: 'Emirates ID captured successfully' });
  } catch (error) {
    next(error);
  }
}
