import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import Card from "../models/cardModel.js";
import Column from "../models/columnsModel.js";

const addCard = async (req, res) => {
  const { column: columnId, title } = req.body;

  const existingCard = await Card.findOne({ title, column: columnId });
  const exsistColumn = await Column.findById(columnId);
  if (!exsistColumn) {
    throw HttpError(404, `Column with id=${columnId} not found`);
  }
  if (existingCard) {
    throw HttpError(409, `A card with this ${title} is already in this Сolumn`);
  }

  const result = await Card.create({ ...req.body });

  res.status(201).json(result);
};

const updateCard = async (req, res) => {
  const { id } = req.params;

  const result = await Card.findByIdAndUpdate(id, req.body);
  if (!result) {
    throw HttpError(404, `Card with id=${id} not found`);
  }

  res.json(result);
};

const deleteCard = async (req, res) => {
  const { id } = req.params;
  const result = await Card.findByIdAndDelete(id);
  if (!result) {
    throw HttpError(404, `Card with id=${id} not found`);
  }
  res.status(200).json(result);
};

const transferCard = async (req, res) => {
  const { id } = req.params;
  const { source_id, destination_id } = req.body;

  const exsistColumn = await Column.findById(source_id);
  if (!exsistColumn) {
    throw HttpError(400, `Column with id=${source_id} not found`);
  }

  const result = await Card.findByIdAndUpdate(
    id,
    { column: destination_id },
  );
  if (!result) {
    throw HttpError(404, `Card with id=${id} not found`);
  }

  res.json(result);
};

export default {
  addCard: ctrlWrapper(addCard),
  updateCard: ctrlWrapper(updateCard),
  deleteCard: ctrlWrapper(deleteCard),
  transferCard: ctrlWrapper(transferCard),
};
