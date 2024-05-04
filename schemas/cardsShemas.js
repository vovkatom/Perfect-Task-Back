import Joi from "joi";
import { priorities, deadlineRegex } from "../constants/boardsArray.js";

const cardAddSchema = Joi.object({
  title: Joi.string().required().messages({
    "any.required": `missing required "title" field`,
  }),
  description: Joi.string(),
  priority: Joi.string().valid(...priorities),
  deadline: Joi.string().pattern(deadlineRegex),
  column: Joi.string().required().messages({
    "any.required": `missing required "column" field`,
  }),
});

const cardUpdateSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  priority: Joi.string().valid(...priorities),
  deadline: Joi.string().pattern(deadlineRegex),
});

const cardTransferSchema = Joi.object({
  source_id: Joi.string().required().messages({
    "any.required": `missing required "source" field`,
  }),
  destination_id: Joi.string().required().messages({
    "any.required": `missing required "destination" field`,
  }),
});

export default {
  cardAddSchema,
  cardUpdateSchema,
  cardTransferSchema,
};
