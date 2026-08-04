import { Joi, Segments } from "celebrate";
import { isValidObjectId } from "mongoose";

import { phoneRegexp } from "../constants/index.js";

const objectIdValidator = (value, helpers)=> {
  return isValidObjectId(value) ? value : helpers.message("invalid id format");
}

export const createContactSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).required().messages({
      "any.required": "name must be exist",
      "string.base": "name must be string"
    }),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(phoneRegexp).required(),
    group: Joi.string().required()
  })
}

export const contactIdSchema = {
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().custom(objectIdValidator).required()
  })
}

export const updateContactSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).messages({
      "string.base": "name must be string"
    }),
    email: Joi.string().email(),
    phone: Joi.string().pattern(phoneRegexp),
    group: Joi.string()
  }).min(1)
}
