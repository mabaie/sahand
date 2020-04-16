'use strict';
const Joi = require('joi');
const persianStringRegExp = /^[\u0621-\u0628\u062A-\u063A\u0641-\u0642\u0644-\u0648\u064E-\u0651\u0655\u067E\u0686\u0698\u06A9\u06AF\u06BE\u06CC\s]+$/;

const validator = Joi.object().keys({
    Name: Joi.string().trim().min(3).max(50)
        .regex(persianStringRegExp).optional(),
    Grade: Joi.string().trim().valid('پیش‌دبستانی', 'اول', 'دوم', 'سوم', 'چهارم', 'پنجم', 'ششم').optional(),
    Capacity: Joi.number().min(1).max(1000).optional(),
}).min(1);

module.exports = validator;