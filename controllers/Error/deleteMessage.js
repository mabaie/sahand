'use strict';

const ExternalError = require('../../Models/Error/External');
function deleteMessage(value) {
    switch(value.error.details[0].path[0]){
    case 'sender_id': return new ExternalError(101);
    case 'date': return new ExternalError(102); 
    default: return new Error();
    }
}
module.exports = deleteMessage;