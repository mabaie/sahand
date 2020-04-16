'use strict';

const ExternalError = require('../../Models/Error/External');
function getContactList(value) {
    switch(value.error.details[0].path[0]){
    case 'lname': return new ExternalError(2);
    default: return new Error();
    }
}
module.exports = getContactList;