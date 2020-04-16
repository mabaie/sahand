'use strict'
const Joi = require('joi');

module.exports = Joi.object().keys({
        courseID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
});