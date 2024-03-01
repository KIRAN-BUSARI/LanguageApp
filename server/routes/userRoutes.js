import { Router } from 'express';
import { getAllUsers, getUser, getUserTranslations, logout, signin, signup } from '../controllers/userController.js';
import { adminMiddleware, isLoggedIn } from '../middlewares/authMiddleware.js';

const router = Router()

router.route('/signup').post(signup);
router.route('/signin').post(signin);
router.route('/getUser').get(isLoggedIn, getUser);
router.route("/getAllUsers").get(isLoggedIn, adminMiddleware("admin"), getAllUsers);
router.route('/logout').delete(isLoggedIn, logout);
router.route('/:userId/translations').get(isLoggedIn, adminMiddleware("admin"), getUserTranslations);

export default router;