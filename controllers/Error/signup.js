'use strict';

const ExternalError = require('../../Models/Error/External');
function signUpErrorHandler(value) {
    
    switch(value.error.details[0].path[0]){
    case 'FirstName': return new ExternalError(1);
    case 'LastName': return new ExternalError(2);
    case 'FatherName': return new ExternalError(3);
    case 'ID': return new ExternalError(4);
    case 'EducationalDegree': return new ExternalError(5);
    case 'Major': return new ExternalError(6);
    case 'BirthDay': return new ExternalError(7);
    case 'Job': return new ExternalError(8);
    case 'Password': return new ExternalError(9);
    case 'ConfirmPassword': return new ExternalError(10);
    case 'Mobile': return new ExternalError(11);
    case 'Email': return new ExternalError(12);
    case 'SchoolName': return new ExternalError(32);
    case 'SchoolType': return new ExternalError(33);
    default: return new Error();
    }
}
module.exports = signUpErrorHandler;