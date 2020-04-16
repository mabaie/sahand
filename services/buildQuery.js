'use strict';
function buildQuery(data){
    let query={};
    for(let rec in data){
        let key='';
        switch(rec){
            case 'FirstName': key='fname'; break;
            case 'LastName': key = 'lname'; break;
            case 'FatherName': key = 'faname'; break;
            case 'ID': key = 'userName'; break;
            case 'EducationalDegree': key = 'degree'; break;
            case 'Degree': key = 'degree'; break;
            case 'Major': key = 'major'; break;
            case 'BirthDay': key = 'birthday'; break;
            case 'Mobile': key = 'mobile'; break;
            case 'Email': key = 'email'; break;
            case 'Address': key = 'address'; break;
            case 'CanLogin': key = 'canLogin'; break;
            case 'IsActive': key = 'isActive'; break;
            case 'SchoolName': key = 'sname'; break;
            case 'SchoolType': key = 'stype'; break;
            case 'Grade': key = 'grade'; break;
            case 'HomeAddress': key = 'haddress'; break;
            case 'WorkAddress': key = 'waddress'; break;
            case 'Course': key = 'course'; break;
            case 'Name': key = 'cname'; break;
            case 'Capacity': key = 'capacity'; break;
            case 'Image': key = 'image'; break;
            case 'BirthPlace': key = 'birthPlace'; break;
            case 'IssuePlace': key = 'issuePlace'; break;
            case 'Religion': key = 'religion'; break;
            case 'Mazhab': key = 'mazhab'; break;
            case 'Citizenship': key = 'citizenship'; break;
            case 'School_id': key = 'school_id'; break;
            case 'HomePhone': key = 'homePhone'; break;
            case 'Job': key = 'job'; break; 
        }
        query[key] = data[rec];
    }
    return query;
}
module.exports = buildQuery;
