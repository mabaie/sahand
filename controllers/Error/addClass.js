'use strict';

const ExternalError = require('../../Models/Error/External');
function addClassErrorHandler(value) {
    
    switch(value.error.details[0].path[0]){
    case 'Name': return new ExternalError(77);
    case 'Grade': return new ExternalError(73);
    case 'Capacity': return new ExternalError(75);
    default: return new Error();
    }
}
module.exports = addClassErrorHandler;