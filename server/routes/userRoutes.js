import { Router } from 'express';
import { getUser, logout, signin, signup } from '../controllers/userController.js';
import { isLoggedIn } from '../middlewares/authMiddleware.js';

const router = Router()

router.route('/signup').post(signup);
router.route('/signin').post(signin);
router.route('/getUser').get(isLoggedIn, getUser);
router.route('/logout').delete(isLoggedIn, logout);

export default router;