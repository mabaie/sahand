'use strict';
const configs = require('../configs');
const ExternalError = require('../Models/Error/External');

function bearerExtractor(req, res, next){
    const parsed = req.get('Authorization').split(' ');
    if((parsed[0] == 'Bearer') && (parsed[1] == configs.APP_API_SECRET_KEY)){
        next();
    }
    else {
        const err = new ExternalError(0); 
        next(err);
    }
}

module.exports = bearerExtractor;