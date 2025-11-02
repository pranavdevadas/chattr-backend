import express from 'express';
import { UserController } from '../controller/userController';
import { container } from '../config/container';
import { protect } from '../middleware/authMiddleware';
import { uploadProfileImage } from '../config/multer';

const router = express.Router();
const userController = container.get<UserController>('UserController');

// Auth
router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/verify-otp', userController.verifyOtp);
router.post('/resend-otp', userController.resendOtp)
router.get('/refresh', userController.refresh);
router.post('/logout', userController.logout);

// Profile
router.patch('/update-user', protect, uploadProfileImage.single('profileImage'), userController.updateUser)

// Search User
router.post('/search', userController.searchUsers)

// Notification
router.post('/save-fcm-token', protect, userController.saveFcmToken);
router.post('/send-notificaton', protect, userController.sendNotification)


export default router;