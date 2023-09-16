import { Router } from 'express';
import { CreateUserDto, LoginUserDto, VerifyLoginUserDto } from '../dtos/users.dto';
import { AuthMiddleware,AdminAuthMiddleware} from '../middlewares/auth.middleware';
import { ValidationMiddleware } from '../middlewares/validation.middleware';
import { AuthController } from '../controllers';
import { createKYC } from '@/controllers/kyc.controller';
import { addCard } from '@/controllers/card.controller';

export const router = Router();

router.post('/signup', ValidationMiddleware(CreateUserDto), AuthController.signUp);
router.post('/login', ValidationMiddleware(LoginUserDto), AuthController.logIn);
router.post('/verify-login', ValidationMiddleware(VerifyLoginUserDto), AuthController.verifyLogin);
router.post('/verify-signup', ValidationMiddleware(VerifyLoginUserDto), AuthController.verifySignUp);
router.post('/logout', AuthMiddleware, AuthController.logOut);
router.post('/otp/sms', AuthMiddleware, AuthController.sendSmsOtp);
router.post('/otp/email', AuthMiddleware, AuthController.sendEmailOtp);
router.post('/verify/otp/sms', AuthMiddleware, AuthController.verifySmsOtp);
router.post('/verify/otp/email', AuthMiddleware, AuthController.verifyEmailOtp);
router.get('/auth-check', AuthMiddleware, AuthController.authCheck);
router.post('/admin/signup', AuthController.adminSignUp);
router.post('/admin/login', AuthController.adminLogIn);
router.post('/kyc', createKYC);
router.post('/card', addCard);

router.post('/regenerate-otp', AuthController.regenerateOtp);

const AuthRouter = {
  path: '/',
  router: router,
};
export default AuthRouter;
