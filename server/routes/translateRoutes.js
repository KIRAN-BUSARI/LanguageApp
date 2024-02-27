import { translateController } from "../controllers/translateController.js";
import { isLoggedIn } from "../middlewares/authMiddleware.js";
import { Router } from 'express'

const router = Router();

router.route("/translateLang").post(isLoggedIn, translateController);

export default router;