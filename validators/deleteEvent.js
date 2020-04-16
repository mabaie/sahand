'use strict';
const Joi = require('joi');
const persianAlphaNum = /^[\u0621-\u0628\u062A-\u063A\u0641-\u0642\u0644-\u0648\u064E-\u0651\u0655\u067E\u0686\u0698\u06A9\u06AF\u06BE\u06CC\s\u06F0-\u06F90-9]+$/;
module.exports = Joi.object().keys({
    event: Joi.string().trim().min(3).max(100)
        .required(),
})
