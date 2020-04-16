'use strict';
const ExternalError = require('../Models/Error/External');
const Joi = require('joi');

async function dateValidator(req, res, next){
    const id = req.params.date;
    const validation = Joi.validate(id, Joi.string().isoDate().required());
    if(!validation.error) {
        next();
    }
    else {
        const error = new ExternalError(91);
        next(error);
    }
}

module.exports = dateValidator;