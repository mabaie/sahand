"use strict";
const fs = require("fs");
const multer = require("multer");
const ExternalError = require("../Models/Error/External");
const configs = require("../configs");
const shell = require("shelljs");
const mimeTypeToEXT = require("../services/mimeTypeToEXT");

function fileFilter(req, file, cb) {
  if (file.fieldname !== "assignment" || file.mimetype !== "application/pdf") {
    cb(new ExternalError(87), false);
    return;
  }
  cb(null, true);
}
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = configs.uploadDir + "/assignments";
    if (!fs.existsSync(dir)) {
      shell.mkdir("-p", dir);
    }
    cb(null, dir);
  },
  filename: function(req, file, cb) {
    file.filename =
      req.params.courseID.toString() +
      "-" +
      new Date().valueOf() +
      mimeTypeToEXT(file.mimetype);
    cb(null, file.filename);
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 10485760, files: 1, parts: 5 },
  fileFilter: fileFilter
}).single("assignment");

module.exports = async function(req, res, next) {
  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      switch (err.code) {
        case "LIMIT_UNEXPECTED_FILE":
          return next(new ExternalError(87));
        case "LIMIT_FILE_SIZE":
          return next(new ExternalError(87));
      }
    } else if (err) {
      next(err);
    } else {
      next();
    }
  });
};
