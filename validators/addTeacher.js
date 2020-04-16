'use strict';
const Joi = require('joi');
const nationalIdJoi = require('../services/validation/JoiWithNationalId');
const persianStringRegExp = /^[\u0621-\u0628\u062A-\u063A\u0641-\u0642\u0644-\u0648\u064E-\u0651\u0655\u067E\u0686\u0698\u06A9\u06AF\u06BE\u06CC\s]+$/;
module.exports = Joi.object().keys({
    FirstName: Joi.string().trim().min(3).max(50)
        .regex(persianStringRegExp).required(),
    LastName: Joi.string().trim().min(3).max(50)
        .regex(persianStringRegExp).required(),
    FatherName: Joi.string().trim().min(3).max(50)
        .regex(persianStringRegExp).required(),
    ID: nationalIdJoi.string().trim().min(10).max(10).isNationalId().required(),
    EducationalDegree: Joi.string().trim().valid('زیر دیپلم', 'دیپلم', 'کارشناسی', 'کارشناسی ارشد', 'دکتری').required(),
    Major: Joi.string().trim().min(3).max(50)
        .regex(persianStringRegExp).required(),
    BirthDay: Joi.string().isoDate().required(),
    Mobile: Joi.string().regex(/^9[0-3][0-9]{8}$/).required(),
    Email: Joi.string().email({
        minDomainAtoms: 2
    }).required(),
    HomeAddress: Joi.string().min(6).max(100).required(),
})
