import express from "express";
import cardsController from "../controllers/cardsController.js"
import authenticate from "../middlewares/authenticate.js"
import isValidId from "../middlewares/isValidId.js"
import validateBody from "../decorators/validateBody.js";
import cardSchema from "../schemas/cardsShemas.js";


const cardsRouter = express.Router();

cardsRouter.use(authenticate);

cardsRouter.post("/", validateBody(cardSchema.cardAddSchema), cardsController.addCard);

// cardsRouter.delete("/:id", isValidId, cardsController.deleteCard);

// cardsRouter.put("/:id", isValidId,  validateBody(cardSchema.cardUpdateSchema), cardsController.updateCard);




export default cardsRouter;