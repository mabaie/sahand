'use strict';

const ExternalError = require('../../Models/Error/External');
function sendMessage(value) {
    switch(value.error.details[0].path[0]){
    case 'chat_id': return new ExternalError(98);
    case 'reciver': return new ExternalError(99);
    case 'message': return new ExternalError(100);
    case 'limit': return new ExternalError(23);
    default: return new Error();
    }
}
module.exports = sendMessage;