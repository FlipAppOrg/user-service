// kyc.dtos.ts

import { IsString, IsNotEmpty, IsBoolean, IsNumber } from 'class-validator';

export class KYCCreateDto {
  @IsString()
  @IsNotEmpty()
  public personalId: string;

  @IsBoolean()
  public captureDetails: boolean;

  @IsBoolean()
  public confirmDetails: boolean;

  @IsString() // Assuming emiratesId is a string
  @IsNotEmpty()
  public emiratesId: string;

  @IsNumber()
  public userId: number;
}
