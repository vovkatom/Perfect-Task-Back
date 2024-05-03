import Joi from "joi";
import {priority, deadlineRegex} from "../constants/borderArray.js"

const cardAddSchema = Joi.object({
    title: Joi.string().required()
        .messages({
            "any.required": `missing required "title" field`,
        }),
    description: Joi.string(),
    priority: Joi.string().valid(...priority),
    deadline: Joi.string().pattern(deadlineRegex),
    column: Joi.string().required()
        .messages({
            "any.required": `missing required "column" field`,
        }),
});

const cardUpdateSchema = Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    priority: Joi.string().valid(...priority),
    deadline: Joi.string().pattern(deadlineRegex),
});




export default {
    cardAddSchema,
    cardUpdateSchema,
};
