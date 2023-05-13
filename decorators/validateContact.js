const { HttpError } = require("../utils/HttpError");

const validateContact = (schema) => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      throw new HttpError(400, `Missing fields: ${error.message}`);
    }

    next();
  };

  return func;
};

module.exports = validateContact;
