'use strict';
const Joi = require('joi');
const persianStringRegExp = /^[\u0621-\u0628\u062A-\u063A\u0641-\u0642\u0644-\u0648\u064E-\u0651\u0655\u067E\u0686\u0698\u06A9\u06AF\u06BE\u06CC\s]+$/;
const filterSchema = Joi.object().keys({
    ID: Joi.string().regex(new RegExp('\d*|default')).max(10),
    cname: Joi.string().trim().min(3).max(50)
        .regex(persianStringRegExp),
    coname: Joi.string().trim().min(3).max(50)
        .regex(persianStringRegExp),
    title: Joi.string().trim().min(3).max(50)
        .regex(persianStringRegExp),
    classID: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    tag: Joi.string().trim().min(3).max(50)
        .regex(persianStringRegExp),
    teacherID: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    courseID: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    lastname: Joi.string(),
    grade: Joi.string()
});

module.exports = Joi.object({
    skip: Joi.number().required(),
    limit: Joi.number().required(),
    filter: filterSchema,
    sort: Joi.string()
});