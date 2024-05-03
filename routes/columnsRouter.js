import express from 'express';
import authenticate from "../middlewares/authenticate.js"
import isValidId from "../middlewares/isValidId.js"
import validateBody from "../decorators/validateBody.js";

import columnsController from "../controllers/columnsController.js";
import columnsSchema from "../schemas/columnsShemas.js";


const columnsRouter = express.Router();

// columnsRouter.use(authenticate);

// columnsRouter.get("/:id", isValidId, columnsController.getColumnById);

columnsRouter.post("/", validateBody(columnsSchema.columnsAddSchema), columnsController.addColumn);

// columnsRouter.put("/:id", isValidId, validateBody(columnsSchema.columnsUpdateSchema), columnsController.updateColumn);

// columnsRouter.delete("/:id", isValidId, columnsController.deleteColumn);

export default columnsRouter;