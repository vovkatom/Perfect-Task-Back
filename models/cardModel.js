import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSetting } from "./hooks.js";
import { priorities, deadlineRegex } from "../constants/boardsArray.js";

const cardSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Set title for card'],
    },
    description: {
        type: String,
    },
    priority: {
        type: String,
        enum: priorities,
        default: "without priority",
    },
    deadline: {
        type: String,
        match: deadlineRegex,
    },
    column: {
        type: Schema.Types.ObjectId,
        ref: 'column',
        required: [true, 'Set column for card'],
    },

}, { versionKey: false, timestamps: true });

cardSchema.pre("findOneAndUpdate", setUpdateSetting);
cardSchema.post("save", handleSaveError);
cardSchema.post("findOneAndUpdate", handleSaveError);

const Card = model("card", cardSchema);

export default Card;