const { HttpError } = require("../utils/HttpError");
const { User } = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");

const createNewUser = async (body) => {
  const { email, password } = body;
  const currentUser = await User.findOne({ email });
  if (currentUser) {
    throw new HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 12);

  const defaultAvatar = gravatar.url(email);

  const newUser = await User.create({
    ...body,
    password: hashPassword,
    avatarURL: defaultAvatar,
  });
  return {
    user: {
      email: newUser.email,
      avatarURL: newUser.avatarURL,
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

const changeUserAvatar = async (file, user) => {
  const { _id } = user;
  const { path: oldPath, filename } = file;
  const resized = await Jimp.read(oldPath)
    .then((file) => {
      return file.resize(250, 250).write(oldPath);
    })
    .catch((err) => {
      console.error(err);
    });

  console.log(resized);

  const newPath = `${path.join(process.cwd(), "public", "avatars", filename)}`;
  await fs.rename(oldPath, newPath);
  const changedUser = await User.findByIdAndUpdate(
    _id,
    { avatarURL: `${path.join("avatars", filename)}` },
    {
      new: true,
    }
  );
  return { avatarURL: changedUser.avatarURL };
};

module.exports = {
  createNewUser,
  loginCurrentUser,
  logoutCurrentUser,
  changeUserSubscription,
  changeUserAvatar,
};
