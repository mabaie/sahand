'use strict';

const ExternalError = require('../../Models/Error/External');
function appPostAttendanceErrorHandler(value) {
    switch (value.error.details[0].path[0]) {
        case 'course_id': return new ExternalError(81);
        case 'present': return new ExternalError(83);
        default: return new Error();
    }
}
module.exports = appPostAttendanceErrorHandler;