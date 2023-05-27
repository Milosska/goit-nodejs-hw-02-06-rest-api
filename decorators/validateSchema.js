const { HttpError } = require("../utils/HttpError");

const validateSchema = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      throw new HttpError(400, `Missing fields: ${error.message}`);
    }

    next();
  };
};

module.exports = validateSchema;
