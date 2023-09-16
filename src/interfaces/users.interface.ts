export interface User {
  id?: number;
  email: string;
  password?: string;
  emailOtp?: string;
  phoneOtp?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  userRole: number;
  phone?: string;
  name: string;
}
