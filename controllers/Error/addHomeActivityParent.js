'use strict';

const ExternalError = require('../../Models/Error/External');
function addParentErrorHandler(value) {
    switch(value.error.details[0].path[0]){
    case 'id': return new ExternalError(66);
    case 'content': return new ExternalError(67);
    default: return new Error();
    }
}
module.exports = addParentErrorHandler;