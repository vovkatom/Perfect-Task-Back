import Board from "../models/boardModel.js";
import Column from "../models/columnsModel.js";
import Card from "../models/cardModel.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

const addColumn = async (req, res) => {
  const { board: boardId, title } = req.body;

  const existingColumn = await Column.findOne({ title, board: boardId });
  const existingBoard = await Board.findById(boardId);

  if (!existingBoard) {
    throw HttpError(404, `Such board with id ${boardId} does not exist`);
  }
  if (existingColumn) {
    throw HttpError(
      409,
      `Such column with title ${title} has already been added to this Board`
    );
  }
  const result = await Column.create({
    ...req.body,
  });
  res.status(201).json(result);
};

const getColumnById = async (req, res) => {
  const { id } = req.params;
  const result = await Column.findById(id);
  if (!result) {
    throw HttpError(404, `Such column with id ${id} not found`);
  }
  res.json(result);
};

const updateColumn = async (req, res) => {
  const { id } = req.params;
  const { board: boardId, title } = req.body;

  const existingColumn = await Column.findOne({ title, board: boardId });
  if (existingColumn) {
    throw HttpError(
      409,
      `Such column with title ${title} has already been added to this Board`
    );
  }

  const result = await Column.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, `Such column with id ${id} not found`);
  }
  res.json(result);
};


const deleteColumn = async (req, res) => {
  const { id } = req.params;
  const result = await Column.findByIdAndDelete(id);
  if (!result) {
    throw HttpError(404, `Column with id=${id} not found`);
  }

  await Card.deleteMany({ column: id });

  res.status(200).json({
    message: "Column successfully deleted",
    deletedId: result._id,
  });
};

export default {
  addColumn: ctrlWrapper(addColumn),
  updateColumn: ctrlWrapper(updateColumn),
  getColumnById: ctrlWrapper(getColumnById),
  deleteColumn: ctrlWrapper(deleteColumn),
};
