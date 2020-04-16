"use strict";

const ExternalError = require("../../Models/Error/External");
function aboutSchoolErrorHandler(value) {
  if(value.error.details[0].type === 'object.allowUnknown'){
    return new ExternalError(89);
  }

  switch (value.error.details[0].path[0]) {
    case "SchoolName":
      return new ExternalError(32);
    case "AboutSchool": 
      return new ExternalError(88);
    default:
      return new Error();
  }
}
module.exports = aboutSchoolErrorHandler;
