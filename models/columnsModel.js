import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSetting } from "./hooks.js";

const columnSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Set title for column'],
    },
    board: {
        type: Schema.Types.ObjectId,
        ref: 'board',
    },
}, { versionKey: false, timestamps: true });

columnSchema.pre("findOneAndUpdate", setUpdateSetting);
columnSchema.post("save", handleSaveError);
columnSchema.post("findOneAndUpdate", handleSaveError);

const Column = model("column", columnSchema);

export default Column;