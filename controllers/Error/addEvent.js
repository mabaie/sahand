"use strict";

const ExternalError = require("../../Models/Error/External");
function addEventErrorHandler(value) {
  switch (value.error.details[0].path[0]) {
    case "date":
      return new ExternalError(91);
    case "event":
      return new ExternalError(92);
    default:
      return new Error();
  }
}
module.exports = addEventErrorHandler;
