'use strict';
const ExternalError = require('../../Models/Error/External');
function getEncourageParentErrorHandler(value) {
    switch(value.error.details[0].path[0]){
    case 'studentID': return new ExternalError(95);
    case 'courseID': return new ExternalError(96);
    default: return new Error();
    }
}
module.exports = getEncourageParentErrorHandler;