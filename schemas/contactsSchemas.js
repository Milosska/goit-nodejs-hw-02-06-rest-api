const Joi = require("joi");

const ContactSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "field 'name' is missing",
  }),
  email: Joi.string()
    .pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)
    .required()
    .messages({
      "any.required": "field 'email' is missing",
      "string.pattern.base": "email contains invalide option",
    }),
  phone: Joi.string()
    .pattern(
      /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/
    )
    .required()
    .messages({
      "any.required": "field 'phone' is missing",
      "string.pattern.base": "phone contains invalide option",
    }),
  favorite: Joi.boolean(),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean()
    .required()
    .messages({ "any.required": "missing field favorite" }),
});

module.exports = {
  ContactSchema,
  updateFavoriteSchema,
};
