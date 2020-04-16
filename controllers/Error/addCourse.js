'use strict';

const ExternalError = require('../../Models/Error/External');
function addClassErrorHandler(value) {
    
    switch(value.error.details[0].path[0]){
    case 'coname': return new ExternalError(78);
    case 'class_id': return new ExternalError(79);
    case 'teacher_id': return new ExternalError(80);
    default: return new Error();
    }
}
module.exports = addClassErrorHandler;