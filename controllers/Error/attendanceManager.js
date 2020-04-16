'use strict';

const ExternalError = require('../../Models/Error/External');
function appPostAttendanceErrorHandler(value) {
    switch (value.error.details[0].path[0]) {
        case 'date': return new ExternalError(82);
        case 'present': return new ExternalError(83);
        default: return new Error();
    }
}
module.exports = appPostAttendanceErrorHandler;