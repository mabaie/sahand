"use strict";

const ExternalError = require("../../Models/Error/External");
function addSchoolUploadErrorHandler(value) {
    console.log(value.error.details[0].path[0])
  switch (value.error.details[0].path[0]) {
    case "Attachment":
      return new ExternalError(91);
    default:
      return new Error();
  }
}
module.exports = addSchoolUploadErrorHandler;
