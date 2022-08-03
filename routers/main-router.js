import express from "express";
import mainController from "../controllers/main-controller.js";
import gameController from "../controllers/game-controller.js"

const router = express.Router();

router.get('/',mainController.homePage);
router.post('/',mainController.endGame);
router.get('/start_game',mainController.homePage);
router.post('/enter_word',gameController.sendLetter);
router.post('/continue',gameController.continueGame);
router.post('/start_game',mainController.startGame);

export default router;