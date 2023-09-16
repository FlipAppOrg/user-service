import { IsString, IsNotEmpty } from 'class-validator';

export class AddCardDto {
  @IsString()
  @IsNotEmpty()
  public cardNumber: string;

  @IsString()
  @IsNotEmpty()
  public expiry: string;

  @IsString()
  @IsNotEmpty()
  public cvv: string;
}