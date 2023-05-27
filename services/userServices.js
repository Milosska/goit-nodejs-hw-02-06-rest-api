const { HttpError } = require("../utils/HttpError");
const { User } = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;

const createNewUser = async (body) => {
  const { email, password } = body;
  const currentUser = await User.findOne({ email });
  if (currentUser) {
    throw new HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 12);

  const newUser = await User.create({ ...body, password: hashPassword });
  return {
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  };
};

const loginCurrentUser = async (body) => {
  const { email, password } = body;
  const currentUser = await User.findOne({ email });
  if (!currentUser) {
    throw new HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, currentUser.password);
  if (!passwordCompare) {
    throw new HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: currentUser._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(currentUser._id, { token });

  return {
    token,
    user: {
      email: currentUser.email,
      subscription: currentUser.subscription,
    },
  };
};

const logoutCurrentUser = async (user) => {
  const { _id } = user;
  const currentUser = await User.findByIdAndUpdate(_id, { token: "" });
  if (!currentUser) {
    throw new HttpError(401, "Not authorized");
  }
};

const changeUserSubscription = async (body, user) => {
  const { _id } = user;
  const changedUserSubscription = await User.findByIdAndUpdate(_id, body, {
    new: true,
  });
  if (!changedUserSubscription) {
    throw new HttpError(404, "Not found");
  }
  return changedUserSubscription;
};

module.exports = {
  createNewUser,
  loginCurrentUser,
  logoutCurrentUser,
  changeUserSubscription,
};
