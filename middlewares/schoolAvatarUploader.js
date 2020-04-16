"use strict";
const fs = require("fs");
const multer = require("multer");
const ExternalError = require("../Models/Error/External");
const configs = require("../configs");
const shell = require("shelljs");
const mimeTypeToEXT = require("../services/mimeTypeToEXT");

function fileFilter(req, file, cb) {
  if (
    file.fieldname !== "avatar" ||
    (file.mimetype !== "image/png" && file.mimetype !== "image/jpeg")
  ) {
    cb(new ExternalError(87), false);
    return;
  }
  cb(null, true);
}
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = configs.uploadDir + "/schools/avatar";
    if (!fs.existsSync(dir)) {
      shell.mkdir("-p", dir);
    }
    cb(null, dir);
  },
  filename: function(req, file, cb) {
    const dir = configs.uploadDir + "/schools/avatar";
    console.log('-f', dir + '/' + req.data._id.toString() + '*');
    shell.rm(dir + '/' + req.data._id.toString() + '*')
    file.filename = req.data._id.toString() + "-" + new Date() + mimeTypeToEXT(file.mimetype);
    cb(
      null,
      file.filename
    );
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024, files: 1, parts: 1 },
  fileFilter: fileFilter
}).single("avatar");

module.exports = function(req, res, next) {
  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      switch (err.code) {
        case "LIMIT_UNEXPECTED_FILE":
          return next(new ExternalError(87));
      }
    } else if (err) {
      next(err);
    } else {
      next();
    }
  });
};
