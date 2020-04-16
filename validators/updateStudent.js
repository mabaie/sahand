'use strict';
const Joi = require('joi');
const nationalIdJoi = require('../services/validation/JoiWithNationalId');
const persianStringRegExp = /^[\u0621-\u0628\u062A-\u063A\u0641-\u0642\u0644-\u0648\u064E-\u0651\u0655\u067E\u0686\u0698\u06A9\u06AF\u06BE\u06CC\s]+$/;

const validator = Joi.object().keys({
    FirstName: Joi.string().trim().min(3).max(50)
        .regex(persianStringRegExp).optional(),
    LastName: Joi.string().trim().min(3).max(50)
        .regex(persianStringRegExp).optional(),
    ID: nationalIdJoi.string().trim().min(10).max(10).isNationalId().optional(),
    Grade: Joi.string().trim().valid('پیش‌دبستانی', 'اول', 'دوم', 'سوم', 'چهارم', 'پنجم', 'ششم').optional(),
    BirthDay: Joi.string().isoDate().optional(),
    Mobile: Joi.string().regex(/^9[0-3][0-9]{8}$/).optional(),
    Email: Joi.string().email({
        minDomainAtoms: 2
    }).optional(),
    Image: Joi.string().optional(),
    BirthPlace: Joi.string().trim().min(3).max(50)
        .regex(persianStringRegExp),
    IssuePlace: Joi.string().trim().min(3).max(50)
        .regex(persianStringRegExp),
    Religion: Joi.string().trim().min(3).max(50)
        .regex(persianStringRegExp),
    Mazhab: Joi.string().trim().min(3).max(50)
        .regex(persianStringRegExp),
    Citizenship: Joi.string().trim().min(3).max(50)
        .regex(persianStringRegExp),
}).min(1);

module.exports = validator;