'use strict';
const ExternalError = require('../Models/Error/External');
const Joi = require('joi');

async function idValidator(req, res, next){
    const id = req.params.id;
    const validation = Joi.validate(id, Joi.string().regex(/^[0-9a-fA-F]{24}$/).required());
    if(!validation.error) {
        next();
    }
    else {
        const error = new ExternalError(19);
        next(error);
    }
}

module.exports = idValidator;