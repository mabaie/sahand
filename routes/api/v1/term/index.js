"use strict";
const authorization = require("../../../../middlewares/authorization");
const managerAuthorization = require("../../../../services/authorizators/manager");
const termListGetController = require("../../../../controllers/get/termList");
const termListUpdateController = require("../../../../controllers/update/termUpdate");
const termAddController = require('../../../../controllers/add/termAdd');
const router = require("express").Router();
const appValidator = require("../../../../middlewares/appValidator");

const Joi = require('joi');
const persianAlphaNum = /^[\u0621-\u0628\u062A-\u063A\u0641-\u0642\u0644-\u0648\u064E-\u0651\u0655\u067E\u0686\u0698\u06A9\u06AF\u06BE\u06CC\s\u06F0-\u06F90-9]+$/;
const ExternalError = require("../../../../Models/Error/External");

router.get(
    "/term-list",
    authorization(managerAuthorization),
    termListGetController
  );
  router.put(
    "/term-update",
    authorization(managerAuthorization),
    appValidator(Joi.object().keys({
      Title: Joi.string().trim().min(2).max(50)
        .regex(persianAlphaNum).required(),
      ID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
      }),(value)=> {
        if(value.error.details[0].type === 'object.allowUnknown'){
          return new ExternalError(89);
        }
      
        switch (value.error.details[0].path[0]) {
          case "Title":
            return new ExternalError(32);
          case "ID":
            return new ExternalError(20);
          default:
            return new Error();
        }
      }),
    termListUpdateController
  );
  router.post(
    "/term-add",
    authorization(managerAuthorization),
    appValidator(Joi.object().keys({
      Title: Joi.string().trim().min(2).max(50)
      .regex(persianAlphaNum).required()
  }),(value)=> {
    if(value.error.details[0].type === 'object.allowUnknown'){
      return new ExternalError(89);
    }
  
    switch (value.error.details[0].path[0]) {
      case "Title":
        return new ExternalError(32);
      default:
        return new Error();
    }
  }),
    termAddController
  );
module.exports = router;