'use strict';

const ExternalError = require('../../Models/Error/External');

module.exports = function addParentErrorHandler(value) {
    switch (value.error.details[0].path[0]) {
        case 'OldPass':
            return new ExternalError(38);
        case 'NewPass':
            return new ExternalError(9);
        case 'NewPassConfirm':
            return new ExternalError(10);
        default:
            return new Error();
    }
}
