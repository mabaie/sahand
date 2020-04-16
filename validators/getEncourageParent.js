'use strict';
const Joi = require('joi');
module.exports = Joi.object().keys({
    studentID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    courseID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
});
