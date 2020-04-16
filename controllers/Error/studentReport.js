"use strict";

const ExternalError = require("../../Models/Error/External");
function aboutSchoolErrorHandler(value) {
  if(value.error.details[0].type === 'object.allowUnknown'){
    return new ExternalError(89);
  }

  switch (value.error.details[0].path[0]) {
    case "register_min":
      return new ExternalError(100);
    case "register_max":
      return new ExternalError(101);
    case "birth_min":
      return new ExternalError(102);
    case "birth_max":
      return new ExternalError(103);
    case "birth_month":
      return new ExternalError(104);
    case "grade":
      return new ExternalError(105);
    case "cname":
      return new ExternalError(106);
    default:
      return new Error();
  }
}
module.exports = aboutSchoolErrorHandler;
/*
  {
    register_min:this.state.registerMin.toISOString(),
    register_max:this.state.registerMax.toISOString(),
    birth_min:this.state.birthMin.toISOString(),
    birth_max:this.state.birthMax.toISOString(),
    birth_month:this.state.birthMonth,
    grade: this.state.grade==0 ? "default": this.grades[this.state.grade],
    cname: this.state.cname==0 ? "default": this.cnames[this.state.cname]
  }
*/