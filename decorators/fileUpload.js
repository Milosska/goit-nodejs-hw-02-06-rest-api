const multer = require("multer");
const path = require("path");
const { HttpError } = require("../utils/HttpError");

const destination = path.resolve("temp");

const storage = multer.diskStorage({
  destination,
  filename: (req, file, cb) => {
    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const newName = `${uniquePrefix}_${file.originalname}`;
    cb(null, newName);
  },
});

const limits = {
  fileSize: 1024 * 1024,
};

const fileFilter = (req, file, cb) => {
  const { mimetype } = file;
  if (mimetype === "image/jpeg" || mimetype === "image/png") {
    return cb(null, true);
  }
  cb(new HttpError(400, "File extension should be .jpg or .png"));
};

const fileUpload = multer({
  storage,
  limits,
  fileFilter,
});

module.exports = fileUpload;
