import Joi from "joi";
import { emailRegepxp } from "../constants/user-constants.js";

export const emailHelpShemas = Joi.object({
    email: Joi.string()
        .pattern(emailRegepxp)
        .required()
        .messages({
            "any.required": `"email" must be exist`
        }),
    message: Joi.string()
        .min(5)
        .required()
        .messages({
            "any.required": `write your message`
        }),
});

export default emailHelpShemas
