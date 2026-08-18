import { Joi, Segments } from "celebrate";

export const registerUserSchema = {
  [Segments.BODY]: Joi.object({
    username: Joi.string().min(3),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  })
}

export const verifyUserSchema = {
  [Segments.BODY]: Joi.object({
    token: Joi.string().required()
  })
}

export const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  })
}
