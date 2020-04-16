'use strict';
const Joi = require('joi');

module.exports = Joi.object().keys({
    ids: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).min(1).required(),
});