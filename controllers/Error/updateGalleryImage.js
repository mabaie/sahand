
"use strict";

const ExternalError = require("../../Models/Error/External");
function addGalleryManagerErrorHandler(value) {
    console.log("Eroor is here detaul : ",value.error.details[0])
  switch (value.error.details[0].path[0]) {
    case "Tag":
      return new ExternalError(89);
    case "Caption":
      return new ExternalError(90);
    default:
      return new Error();
  }
}
module.exports = addGalleryManagerErrorHandler;
