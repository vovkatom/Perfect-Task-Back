import mongoose from "mongoose";
import Board from "../models/boardModel.js";
import Column from "../models/columnsModel.js";
import Card from "../models/cardModel.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import fetchFromCloudinary from "../helpers/fetchFromCloudinary.js";

const addBoard = async (req, res) => {
  const { _id: owner } = req.user;
  const { background, title } = req.body;

  const boardData = { ...req.body };

  const existingBoard = await Board.findOne({ title, owner });

  if (existingBoard) {
    throw HttpError(
      409,
      `This user already has a board with the same  ${title} `
    );
  }

  if (background) {
    boardData.backgroundURL = await fetchFromCloudinary(background);
  }

  const result = await Board.create({ ...boardData, owner });

  res.status(201).json(result);
};

const getAllBoards = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Board.find({ owner }, "-createdAt -updatedAt").populate(
    "owner",
    "-createdAt -updatedAt -token -accessToken -refreshToken -password"
  );

  res.json(result);
};

const getBoardById = async (req, res) => {
  const { id } = req.params;
  const exsistBoard = await Board.findById(id);
  if (!exsistBoard) {
    throw HttpError(404, `Board with id=${id} not found`);
  }

  const result = await Board.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $unwind: {
        path: "$owner",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "columns",
        localField: "_id",
        foreignField: "board",
        as: "columns",
      },
    },
    {
      $unwind: {
        path: "$columns",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "cards",
        localField: "columns._id",
        foreignField: "column",
        as: "columns.cards",
      },
    },
    {
      $project: {
        "owner.password": 0,
        "owner.createdAt": 0,
        "owner.updatedAt": 0,
        "owner.token": 0,
        "columns.board": 0,
        "columns.createdAt": 0,
        "columns.updatedAt": 0,
        "columns.cards.column": 0,
      },
    },
    {
      $group: {
        _id: "$_id",
        title: { $first: "$title" },
        icon: { $first: "$icon" },
        background: { $first: "$background" },
        backgroundURL: { $first: "$backgroundURL" },
        owner: { $first: "$owner" },
        columns: { $push: "$columns" },
      },
    },
  ]);

  res.json(result[0]);
};

const updateBoard = async (req, res) => {
  const { id } = req.params;
  const { background } = req.body;

  const updateBoardData = { ...req.body };

  if (background) {
    updateBoardData.backgroundURL = await fetchFromCloudinary(background);
  }

  const result = await Board.findByIdAndUpdate(id, updateBoardData);
  if (!result) {
    throw HttpError(404, `Board with id=${id} not found`);
  }

  res.json(result);
};

const deleteBoard = async (req, res) => {
  const { id } = req.params;

  const result = await Board.findByIdAndDelete(id);
  if (!result) {
    throw HttpError(404, `Board with id=${id} not found`);
  }

  const deletedColumn = await Column.find({ board: id });
  if (deletedColumn) {
    deletedColumn.forEach(async (_id) => {
      await Card.deleteMany({ column: _id });
    });
    await Column.deleteMany({ board: id });
  }

  res.status(200).json({ message: "Board deleted", deletedId: result._id });
};

export default {
  addBoard: ctrlWrapper(addBoard),
  getAllBoards: ctrlWrapper(getAllBoards),
  getBoardById: ctrlWrapper(getBoardById),
  updateBoard: ctrlWrapper(updateBoard),
  deleteBoard: ctrlWrapper(deleteBoard),
};
