'use strict';
const Joi = require('joi');

module.exports = Joi.object({
    chat_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    reciver: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    message: Joi.string().trim().min(1).max(1000).required(),
    limit: Joi.number().required()
});