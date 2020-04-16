'use strict';
const Joi = require('joi');
module.exports = Joi.object().keys({
    course_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    present: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).required()
})