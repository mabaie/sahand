'use strict';

const ExternalError = require('../../Models/Error/External');
function deleteManager(value) {
    switch(value.error.details[0].path[0]){
    case 'ids': return new ExternalError(34);
    default: return new Error();
    }
}
module.exports = deleteManager;