import express from 'express';
import userController from '../controllers/user.js';
const router = express.Router();

router.post('/request-otp', userController.requestOTP);
router.post('/user/register', userController.register);
router.post('/user/login',userController.login);
router.post('/user/reset-password', userController.resetPassword);
router.post('/user/logout', userController.logout);


export default router;