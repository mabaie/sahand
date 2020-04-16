'use strict';

const ExternalError = require('../../Models/Error/External');
function addAppointmentErrorHandler(value) {
    
    switch(value.error.details[0].path[0]){
    case 'teacherID': return new ExternalError(91);
    case 'appointments': return new ExternalError(92);
    default: return new Error();
    }
}
module.exports = addAppointmentErrorHandler;