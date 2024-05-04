import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import Card from "../models/cardModel.js";
import Column from "../models/columnsModel.js";

const addCard = async (req, res) => {
    const { column: columnId } = req.body;
    const exsistColumn = await Column.findById(columnId);
    if (!exsistColumn) {
        throw HttpError(404, `Column with id=${columnId} not found`);
    }

    const result = await Card.create({ ...req.body });

    res.status(201).json(result);
};

export default {
  addCard: ctrlWrapper(addCard),
//     getAllBoards: ctrlWrapper(getAllBoards),
//   getBoardById: ctrlWrapper(getBoardById),
};;