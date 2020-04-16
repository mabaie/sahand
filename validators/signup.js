'use strict';
const Joi = require('joi');
const nationalIdJoi = require('../services/validation/JoiWithNationalId');
const persianStringRegExp = /^[\u0621-\u0628\u062A-\u063A\u0641-\u0642\u0644-\u0648\u064E-\u0651\u0655\u067E\u0686\u0698\u06A9\u06AF\u06BE\u06CC\s]+$/;
const persianAlphaNum = /^[\u0621-\u0628\u062A-\u063A\u0641-\u0642\u0644-\u0648\u064E-\u0651\u0655\u067E\u0686\u0698\u06A9\u06AF\u06BE\u06CC\s\u06F0-\u06F90-9]+$/;
module.exports = Joi.object().keys({
    FirstName: Joi.string().trim().min(3).max(50)
        .regex(persianStringRegExp).required(),
    LastName: Joi.string().trim().min(3).max(50)
        .regex(persianStringRegExp).required(),
    FatherName: Joi.string().trim().min(3).max(50)
        .regex(persianStringRegExp).required(),
    ID: nationalIdJoi.string().trim().min(10).max(10).isNationalId().required(),
    EducationalDegree: Joi.string().trim().valid('زیر دیپلم', 'دیپلم', 'کارشناسی', 'کارشناسی ارشد', 'دکتری'),
    Major: Joi.string().trim().min(3).max(50)
        .regex(persianStringRegExp),
    BirthDay: Joi.string().isoDate().required(),
    Job: Joi.string().trim().min(3).max(30)
        .regex(persianStringRegExp).optional(),
    Password: Joi.string().min(6).max(30).when('Type', {
        is: 'manager',
        then: Joi.optional(),
        otherwise: Joi.required()
    }),
    ConfirmPassword: Joi.string().valid(Joi.ref('Password')).when('Type', {
        is: 'manager',
        then: Joi.optional(),
        otherwise: Joi.required()
    }),
    Mobile: Joi.string().regex(/^9[0-3][0-9]{8}$/).required(),
    Email: Joi.string().email({
        minDomainAtoms: 2
    }).required(),
    Address: Joi.string().min(6).max(100).optional(),
    SchoolName: Joi.string().trim().min(2).max(50)
        .regex(persianAlphaNum).when('Type', {
            is: 'manager',
            then: Joi.required(),
            otherwise: Joi.forbidden()
        }),
    SchoolType: Joi.string().trim().valid('دبستان', 'متوسطه‌ی اول', 'متوسطه‌ی دوم').when('Type', {
        is: 'manager',
        then: Joi.required(),
        otherwise: Joi.forbidden(),
    }),
    Type: Joi.string().trim().valid('parent', 'admin', 'student', 'manager', 'teacher').required(),
}).with('Password', 'ConfirmPassword');