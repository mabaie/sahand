'use strict';
const Joi = require('joi');

module.exports = Joi.object().keys({
    OldPass: Joi.string().min(6).max(30).required(),
    NewPass: Joi.string().min(6).max(30).required(),
    NewPassConfirm: Joi.string().valid(Joi.ref('NewPass')).required(),
})