'use strict';

const Joi = require('joi');

function appValidator(schema, errorHandler) {
    return (req, res, next) => {
        const value = Joi.validate(req.body, schema);
        if(!value.error) {
            req.body.valid = value;
            next();
        }
        else {
            const error = errorHandler(value);
            return next(error);
        }
    };
}

module.exports = appValidator;