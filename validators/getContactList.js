'use strict';
const Joi = require('joi');

module.exports = Joi.object().keys({
    lname: Joi.string().trim().min(2).max(100).required()
});