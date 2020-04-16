'use strict';

const ExternalError = require('../../Models/Error/External');
function getChats(value) {
    switch(value.error.details[0].path[0]){
    case 'skip': return new ExternalError(22);
    case 'limit': return new ExternalError(23);
    default: return new Error();
    }
}
module.exports = getChats;