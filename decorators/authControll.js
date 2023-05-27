const { HttpError } = require("../utils/HttpError");
const { SECRET_KEY } = process.env;
const jwt = require("jsonwebtoken");
const { User } = require("../models/users");

const authControll = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(new HttpError(401, "Not authorized"));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user || !token || user.token !== token) {
      next(new HttpError(401, "Not authorized"));
    }

    req.user = user;
    next();
  } catch {
    next(new HttpError(401, "Not authorized"));
  }
};

module.exports = authControll;
