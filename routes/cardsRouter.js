import express from "express";
import cardsController from "../controllers/cardsController.js"
import authenticate from "../middlewares/authenticate.js"
import isValidId from "../middlewares/isValidId.js"
import validateBody from "../decorators/validateBody.js";
import cardSchema from "../schemas/cardsShemas.js";


const cardsRouter = express.Router();

cardsRouter.use(authenticate);

cardsRouter.post("/", validateBody(cardSchema.cardAddSchema), cardsController.addCard);
cardsRouter.put("/:id", isValidId,  validateBody(cardSchema.cardUpdateSchema), cardsController.updateCard);
cardsRouter.delete("/:id", isValidId, cardsController.deleteCard);
cardsRouter.patch("/:id/transfer", isValidId, validateBody(cardSchema.cardTransferSchema), cardsController.transferCard);




export default cardsRouter;