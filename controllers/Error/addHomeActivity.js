'use strict';

const ExternalError = require('../../Models/Error/External');
function addEncourageErrorHandler(value) {
    
    switch(value.error.details[0].path[0]){
    case 'title': return new ExternalError(89);
    case 'type': return new ExternalError(90);
    default: return new Error();
    }
}
module.exports = addEncourageErrorHandler;