import express from "express";
import boardsController from "../controllers/boardsController.js";
import validateBody from "../decorators/validateBody.js";
import boardsShemas from "../schemas/boardsShemas.js"
import authenticate from "../middlewares/authenticate.js"

const boardsRouter = express.Router();

boardsRouter.use(authenticate);

// boardsRouter.get("/", boardsController.getAllBoards);

// boardsRouter.get("/:id", isValidId, boardsController.getBoardById);

// boardsRouter.post("/", isEmptyBody, validateBody(boardSchema.boardAddSchema), addBoard);
boardsRouter.post("/",  validateBody(boardsShemas.boardAddSchema), boardsController.addBoard)

// boardsRouter.delete("/:id", isValidId, boardsController.deleteBoard);

// boardsRouter.put("/:id", isValidId, isEmptyBody, validateBody(boardSchema.boardUpdateSchema), boardsController.updateBoard);


export default boardsRouter;