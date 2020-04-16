'use strict';

const ExternalError = require('../../Models/Error/External');
function loginErrorHandler(value) {
    switch(value.error.details[0].path[0]){
    case 'userName': return new ExternalError(16);
    case 'Password': return new ExternalError(17);
    default: return new Error();
    }
}
module.exports = loginErrorHandler;