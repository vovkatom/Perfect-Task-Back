import Joi from "joi";
import {backgrounds, icons} from "../constants/boardsArray.js"

const boardAddSchema = Joi.object({
    title: Joi.string().required()
        .messages({
            "any.required": `missing required "title" field`,
        }),
    icon: Joi.string().valid(...icons),
    background: Joi.string().valid(...backgrounds),
});

const boardUpdateSchema = Joi.object({
  title: Joi.string(),
  icon: Joi.string().valid(...icons),
  background: Joi.string().valid(...backgrounds),
});


export default {
  boardAddSchema,
  boardUpdateSchema,
};
