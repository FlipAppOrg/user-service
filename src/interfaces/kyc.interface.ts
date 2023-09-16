// kyc.interface.ts

export interface KYC {
    id?: number;
    personalId: string;
    captureDetails: boolean;
    confirmDetails: boolean;
    emiratesId: string; // Add the emiratesId property
    userId: number;
    createdAt?: Date;
    updatedAt?: Date;
  }
  