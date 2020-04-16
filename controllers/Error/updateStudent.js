'use strict';

const ExternalError = require('../../Models/Error/External');
function updateStudentErrorHandler(value) {
    
    switch(value.error.details[0].path[0]){
    case 'FirstName': return new ExternalError(1);
    case 'LastName': return new ExternalError(2);
    case 'FatherName': return new ExternalError(3);
    case 'ID': return new ExternalError(4);
    case 'Grade': return new ExternalError(73);
    case 'BirthDay': return new ExternalError(7);
    case 'Mobile': return new ExternalError(11);
    case 'Email': return new ExternalError(12);
    case 'Image': return new ExternalError(110);
    case 'BirthPlace': return new ExternalError(106);
    case 'IssuePlace': return new ExternalError(107);
    case 'Religion': return new ExternalError(108);
    case 'Mazhab': return new ExternalError(109);
    case 'Citizenship': return new ExternalError(110);
    case 'AcademicYear': return new ExternalError(111);
    default: return new Error();
    }
}
module.exports = updateStudentErrorHandler;