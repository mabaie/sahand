'use strict';
const Joi = require('joi');

module.exports = Joi.object().keys({
    sender_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(), 
    date: Joi.string().isoDate().required()
});