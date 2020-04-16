'use strict';
const Joi = require('../services/validation/JoiWithNationalId');
module.exports = Joi.object().keys({
    date: Joi.string().isoDate().required(),
    list: Joi.array().items(Joi.string().trim().min(10).max(10).isNationalId()).required(),
})
