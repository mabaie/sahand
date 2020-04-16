"use strict";

const ExternalError = require("../../Models/Error/External");
function addSchoolNewsErrorHandler(value) {
    console.log(value.error.details[0].path[0])
  switch (value.error.details[0].path[0]) {
    case "Title":
      return new ExternalError(89);
    case "Description":
      return new ExternalError(90);
    case "Attachment":
      return new ExternalError(91);
    default:
      return new Error();
  }
}
module.exports = addSchoolNewsErrorHandler;
