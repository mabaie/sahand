'use strict';
const Joi = require('joi');
const nationalIdJoi = require('../services/validation/JoiWithNationalId');

module.exports = Joi.object({
    ID: nationalIdJoi.string().trim().min(10).max(10).isNationalId().required(),
});