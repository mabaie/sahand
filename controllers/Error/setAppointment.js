'use strict';
const ExternalError = require('../../Models/Error/External');
function getEncourageParentErrorHandler(value) {
    switch(value.error.details[0].path[0]){
    case 'studentID': return new ExternalError(95);
    case 'appointmentID': return new ExternalError(108);
    case 'start': return new ExternalError(109);
    case 'end': return new ExternalError(110);
    default: return new Error();
    }
}
module.exports = getEncourageParentErrorHandler;