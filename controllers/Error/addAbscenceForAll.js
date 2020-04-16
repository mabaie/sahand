'use strict';

const ExternalError = require('../../Models/Error/External');
function addAbscenceErrorHandler(value) {
    
    switch(value.error.details[0].path[0]){
    case 'date': return new ExternalError(91);
    case 'list': return new ExternalError(103);
    default: return new Error();
    }
}
module.exports = addAbscenceErrorHandler;