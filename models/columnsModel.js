import { Schema, model } from "mongoose";

const columnsSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title for the column is required"],
    },
    columnOwner: {
      type: Schema.Types.ObjectId,
      ref: "board",
    },
  },
  { versionKey: false }
);

export const Columns = model("columns", columnsSchema);
