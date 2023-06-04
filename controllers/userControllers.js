const ctrlWrapper = require("../decorators/ctrlWrapper");
const {
  createNewUser,
  loginCurrentUser,
  logoutCurrentUser,
  changeUserSubscription,
  changeUserAvatar,
} = require("../services/userServices");

const userRegister = async (req, res, next) => {
  const newUser = await createNewUser(req.body);
  res.status(201).json(newUser);
};

const userLogin = async (req, res, next) => {
  const currentUser = await loginCurrentUser(req.body);
  res.status(200).json(currentUser);
};

const userLogout = async (req, res, next) => {
  await logoutCurrentUser(req.user);
  res.status(200).json({ message: "No Content" });
};

const userGetCurrent = async (req, res, next) => {
  const { email, subscription } = req.user;
  res.status(200).json({ email, subscription });
};

const userUpdateSubscriprion = async (req, res, next) => {
  const changedUserSubscription = await changeUserSubscription(
    req.body,
    req.user
  );
  res.status(200).json(changedUserSubscription);
};

const userUpdateAvatar = async (req, res, next) => {
  const newAvatarURL = await changeUserAvatar(req.file, req.user);
  res.status(200).json(newAvatarURL);
};

module.exports = {
  userRegister: ctrlWrapper(userRegister),
  userLogin: ctrlWrapper(userLogin),
  userLogout: ctrlWrapper(userLogout),
  userGetCurrent: ctrlWrapper(userGetCurrent),
  userUpdateSubscriprion: ctrlWrapper(userUpdateSubscriprion),
  userUpdateAvatar: ctrlWrapper(userUpdateAvatar),
};
