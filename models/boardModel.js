import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSetting } from "./hooks.js";
import { icons, backgrounds } from "../constants/boardsArray.js";


const boardSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Set title for board'],
    },
    icon: {
        type: String,
        enum: icons,
        default: "icon-Project",
    },
    background: {
        type: String,
        default: "no-background",
        enum: backgrounds,
    },
    backgroundURL: {
        type: Object,
        default: {},
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'Set owner for board'],
    },
}, { versionKey: false, timestamps: true, minimize: false });

boardSchema.pre("findOneAndUpdate", setUpdateSetting);
boardSchema.post("save", handleSaveError);
boardSchema.post("findOneAndUpdate", handleSaveError);

const Board = model("board", boardSchema);

export default Board; 