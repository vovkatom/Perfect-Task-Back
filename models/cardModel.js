import { Schema, model } from "mongoose";

import { priorities } from "../constants/borderArray";

const cardSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Set name for card title"],
    },
    description: {
      type: String,
      default: null,
    },
    priorities: {
      type: String,
      enum: priorities,
      default: "without",
    },
    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
      default: () => new Date().setDate(new Date().getDate() + 1),
    },
    cardOwner: {
      type: Schema.Types.ObjectId,
      ref: "column",
    },
  },
  { versionKey: false }
);

export const Card = model("card", cardSchema);
