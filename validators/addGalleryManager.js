"use strict";
const Joi = require("joi");
const persianAlphaNum = /^[\u0621-\u0628\u062A-\u063A\u0641-\u0642\u0644-\u0648\u064E-\u0651\u0655\u067E\u0686\u0698\u06A9\u06AF\u06BE\u06CC\s\u06F0-\u06F90-9]+$/;
let images = Joi.object().keys(
  {
    tag: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .regex(persianAlphaNum)
      .required(),
    caption: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .required(),
    url: Joi.string()
      .trim()
      .min(5)
      .max(200)
      .required(),
    });
module.exports = Joi.array().items(
  images
  );