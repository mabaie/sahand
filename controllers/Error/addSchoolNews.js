"use strict";

const ExternalError = require("../../Models/Error/External");
function addSchoolNewsErrorHandler(value) {
    console.log(value.error.details[0].path[0])
  switch (value.error.details[0].path[0]) {
    case "Title":
      return new ExternalError(89);
    case "News":
      return new ExternalError(90);
    default:
      return new Error();
  }
}
module.exports = addSchoolNewsErrorHandler;
