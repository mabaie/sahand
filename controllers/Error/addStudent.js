'use strict';

const ExternalError = require('../../Models/Error/External');
function addParentErrorHandler(value) {
    
    switch(value.error.details[0].path[0]){
    case 'P1_id': return new ExternalError(66);
    case 'P2_id': return new ExternalError(67);
    case '_id': return new ExternalError(68);
    case 'P1FirstName': return new ExternalError(41);
    case 'P1LastName': return new ExternalError(42);
    case 'P1FatherName': return new ExternalError(43);
    case 'P1ID': return new ExternalError(44);
    case 'P1EducationalDegree': return new ExternalError(45);
    case 'P1Major': return new ExternalError(46);
    case 'P1BirthDay': return new ExternalError(47);
    case 'P1Job': return new ExternalError(48);
    case 'P1Mobile': return new ExternalError(49);
    case 'P1Email': return new ExternalError(50);
    case 'P1HomeAddress': return new ExternalError(51);
    case 'P1WorkAddress': return new ExternalError(52);
    case 'P2FirstName': return new ExternalError(53);
    case 'P2LastName': return new ExternalError(54);
    case 'P2FatherName': return new ExternalError(55);
    case 'P2ID': return new ExternalError(56);
    case 'P2EducationalDegree': return new ExternalError(57);
    case 'P2Major': return new ExternalError(58);
    case 'P2BirthDay': return new ExternalError(59);
    case 'P2Job': return new ExternalError(60);
    case 'P2Mobile': return new ExternalError(61);
    case 'P2Email': return new ExternalError(62);
    case 'P2HomeAddress': return new ExternalError(63);
    case 'P2WorkAddress': return new ExternalError(64);
    case 'FirstName': return new ExternalError(1);
    case 'LastName': return new ExternalError(2);
    case 'FatherName': return new ExternalError(3);
    case 'ID': return new ExternalError(4);
    case 'Grade': return new ExternalError(65);
    case 'BirthDay': return new ExternalError(7);
    case 'Mobile': return new ExternalError(11);
    case 'Email': return new ExternalError(12);
    case 'Image': return new ExternalError(104);
    case 'BirthPlace': return new ExternalError(106);
    case 'IssuePlace': return new ExternalError(107);
    case 'Religion': return new ExternalError(108);
    case 'Mazhab': return new ExternalError(109);
    case 'Citizenship': return new ExternalError(110);
    case 'AcademicYear': return new ExternalError(111);
    case 'P2HomePhone':return new ExternalError(112);
    case 'P1HomePhone':return new ExternalError(112);
    default: return new Error();
    }
}
module.exports = addParentErrorHandler;