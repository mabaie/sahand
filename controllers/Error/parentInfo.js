'use strict';

const ExternalError = require('../../Models/Error/External');
function parentInfoErrorHandler(value) {
    
    switch(value.error.details[0].path[0]){
        case 'ID': return new ExternalError(19);
        default: return new Error();
    }
}
module.exports = parentInfoErrorHandler;