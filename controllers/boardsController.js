import Board from "../models/boardModel.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";


const addBoard = async (req, res) => {
    const { _id: owner } = req.user;
    const boardData = { ...req.body };
    const result = await Board.create({ ...boardData, owner });
    res.status(201).json(result);
};

export default {addBoard:ctrlWrapper(addBoard)};