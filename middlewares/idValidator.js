'use strict';
const ExternalError = require('../Models/Error/External');
const JoiWithNationalId = require('../services/validation/JoiWithNationalId');

async function idValidator(req, res, next){
    const id = req.params.id;
    const validation = JoiWithNationalId.validate(id, JoiWithNationalId.string().trim().min(10).max(10).isNationalId());
    if(!validation.error) {
        req.body.valid = validation;
        next();
    }
    else {
        const error = new ExternalError(19);
        next(error);
    }
}

module.exports = idValidator;