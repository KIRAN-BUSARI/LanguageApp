import { translateController } from "../controllers/translateController.js";
import { Router } from 'express'

const router = Router();

router.route("/translateLang").post(translateController);

export default router;