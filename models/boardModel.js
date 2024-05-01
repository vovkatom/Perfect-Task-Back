import { Schema, model } from "mongoose";
import { backgrounds, icons } from "../constants/borderArray";

const boardSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title for the board is required"],
    },
    icon: {
      type: String,
      enum: icons,
      default: "icon-colors",
    },
    background: {
      type: String,
      enum: backgrounds,
      default: "",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false }
);

export const Board = model("board", boardSchema);
