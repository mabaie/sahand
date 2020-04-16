"use strict";
const fs = require("fs");
const multer = require("multer");
const ExternalError = require("../Models/Error/External");
const configs = require("../configs");
const shell = require("shelljs");
const mimeTypeToEXT = require("../services/mimeTypeToEXT");

function fileFilter(req, file, cb) {
  console.log('file is: ',file)
  if (file.fieldname === "Attachment" &&
   (file.mimetype === "application/pdf" || 
   file.mimetype === "video/mp4" || 
   file.mimetype === "image/jpeg" ||
   file.mimetype === "image/jpg" ||
   file.mimetype === "image/png" ||
   file.mimetype === "audio/wav" ||
   file.mimetype === "audio/mp3" ||
   file.mimetype === "audio/ogg" ||
   file.mimetype === "audio/flac" ||
   file.mimetype === "audio/aiff"||
   file.mimetype === "audio/x-aiff") ){
    cb(null, true);
  }else{
    cb(new ExternalError(87), false);
    return;
  }
}
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = configs.uploadDir + "/" + req.params.dir;
    if (!fs.existsSync(dir)) {
      shell.mkdir("-p", dir);
    }
    cb(null, dir);
  },
  filename: function(req, file, cb) {
    file.filename =
    req.params.dir +
    Math.random().toString() +
      "-" +
      new Date().valueOf() +
      mimeTypeToEXT(file.mimetype);
    cb(null, file.filename);
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 100, files: 1, parts: 5 },
  fileFilter: fileFilter
}).single("Attachment");

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
