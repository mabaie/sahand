'use strict';
const Joi = require('joi');
const nationalIdJoi = require('../services/validation/JoiWithNationalId');

module.exports = Joi.object({
    userName: nationalIdJoi.string().trim().min(10).max(10).isNationalId().required(),
    Password: Joi.string().min(6).max(30).required(),
});