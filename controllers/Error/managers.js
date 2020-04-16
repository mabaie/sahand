'use strict';

const ExternalError = require('../../Models/Error/External');
function managersErrorHandler(value) {
    
    switch(value.error.details[0].path[0]){
        case 'skip': return new ExternalError(22); 
        case 'limit': return new ExternalError(23);
        case 'filter': return new ExternalError(24);
        case 'sort': return new ExternalError(25);
        default: return new Error();
    }
}
module.exports = managersErrorHandler;