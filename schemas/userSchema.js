const Joi = require("joi");

const UserRegistrationSchema = Joi.object({
  password: Joi.string()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .required()
    .messages({
      "any.required": "field 'password' is missing",
      "string.pattern.base": "password contains invalide option",
    }),
  email: Joi.string()
    .pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)
    .required()
    .messages({
      "any.required": "field 'email' is missing",
      "string.pattern.base": "email contains invalide option",
    }),
  subscription: Joi.string().valid("starter", "pro", "business").messages({
    "any.invalid": "{{#label}} contains invalide option",
  }),
});

const UserLoginSchema = Joi.object().keys({
  email: UserRegistrationSchema.extract("email"),
  password: UserRegistrationSchema.extract("password"),
});

const UserUpdateSubscriptionSchema = Joi.object().keys({
  subscription: UserRegistrationSchema.extract("subscription"),
});

module.exports = {
  UserRegistrationSchema,
  UserLoginSchema,
  UserUpdateSubscriptionSchema,
};
