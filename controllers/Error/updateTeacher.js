'use strict';

const ExternalError = require('../../Models/Error/External');
function updateTeacherErrorHandler(value) {
    
    switch(value.error.details[0].path[0]){
    case 'FirstName': return new ExternalError(1);
    case 'LastName': return new ExternalError(2);
    case 'FatherName': return new ExternalError(3);
    case 'ID': return new ExternalError(4);
    case 'Grade': return new ExternalError(73);
    case 'BirthDay': return new ExternalError(7);
    case 'Mobile': return new ExternalError(11);
    case 'Email': return new ExternalError(12);
    case 'HomeAddress':return new ExternalError(36);
    case 'Course':return new ExternalError(74);
    case 'EducationalDegree': return new ExternalError(5);
    case 'Major':return new ExternalError(6);
    default: return new Error();
    }
}
module.exports = updateTeacherErrorHandler;