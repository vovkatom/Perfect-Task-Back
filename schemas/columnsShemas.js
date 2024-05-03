import Joi from "joi";

const columnsAddSchema = Joi.object({
    title: Joi.string()
        .required()
        .messages({
            "any.required": `missing required "title" field`,
        }),
    board: Joi.string()
        .required()
        .messages({
            "any.required": `missing required "board" field`,
        }),

});

const columnsUpdateSchema = Joi.object({
    title: Joi.string()
        .required()
        .messages({
            "any.required": `missing required "title" field`,
        }),
    board: Joi.string()
        .required()
        .messages({
            "any.required": `missing required "board" field`,
        }),
});

export default {
    columnsAddSchema,
    columnsUpdateSchema
};