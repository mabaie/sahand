"use strict";

const ExternalError = require("../../Models/Error/External");
function addGalleryManagerErrorHandler(value) {
    console.log("Eroor is here detaul : ",value.error.details[0])
  if(value.error.details[0].path.length==0){
    return new ExternalError(88);
  }
  switch (value.error.details[0].path[0]) {
    case "tag":
      return new ExternalError(89);
    case "caption":
      return new ExternalError(90);
    case "url":
      return new ExternalError(91);
    case "courseID":
      return new ExternalError(92);
    case "schoolID":
      return new ExternalError(92);
    default:
      return new Error();
  }
}
module.exports = addGalleryManagerErrorHandler;
