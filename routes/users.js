const express = require("express");
const validateSchema = require("../decorators/validateSchema");
const authControll = require("../decorators/authControll");
const fileUpload = require("../decorators/fileUpload");
const {
  UserRegistrationSchema,
  UserLoginSchema,
  UserUpdateSubscriptionSchema,
} = require("../schemas/userSchema");
const {
  userRegister,
  userLogin,
  userLogout,
  userGetCurrent,
  userUpdateSubscriprion,
  userUpdateAvatar,
} = require("../controllers/userControllers");

const router = express.Router();

router
  .route("/register")
  .post(validateSchema(UserRegistrationSchema), userRegister);

router.route("/login").post(validateSchema(UserLoginSchema), userLogin);

router.route("/logout").post(authControll, userLogout);

router.route("/current").post(authControll, userGetCurrent);

router
  .route("/current/subscription")
  .patch(
    authControll,
    validateSchema(UserUpdateSubscriptionSchema),
    userUpdateSubscriprion
  );

router
  .route("/avatar")
  .patch(authControll, fileUpload.single("avatar"), userUpdateAvatar);

module.exports = router;
