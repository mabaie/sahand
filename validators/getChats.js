'use strict';
const Joi = require('joi');

module.exports = Joi.object().keys({
    skip: Joi.number().required(),
    limit: Joi.number().required()
});