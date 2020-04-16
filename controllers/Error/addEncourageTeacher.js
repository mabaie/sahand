'use strict';

const ExternalError = require('../../Models/Error/External');
function addEncourageErrorHandler(value) {
    
    switch(value.error.details[0].path[0]){
    case 'description': return new ExternalError(93);
    case 'encourageID': return new ExternalError(94);
    case 'studentID': return new ExternalError(95);
    case 'courseID': return new ExternalError(96);
    case 'star': return new ExternalError(97);
    default: return new Error();
    }
}
module.exports = addEncourageErrorHandler;