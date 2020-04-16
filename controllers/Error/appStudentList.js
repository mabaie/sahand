'use strict';

const ExternalError = require('../../Models/Error/External');
function getStudentListErrorHandler(value) {
    switch(value.error.details[0].path[0]){
    case 'courseID': return new ExternalError(81);
    default: return new Error();
    }
}
module.exports = getStudentListErrorHandler;