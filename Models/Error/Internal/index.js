'use strict';
const PrettyError = require('pretty-error');
const CustomError = require('../index');

function InternalError(errNumber) {
    CustomError.call(this, this.errorCodes[errNumber]);
}

InternalError.prototype = Object.create(CustomError.prototype);
InternalError.prototype.constructor = InternalError;
InternalError.prototype.errorCodes = require('./error-codes');

InternalError.prototype.toString = function () {
    let out = '' + this.id;
    while (out.length < 2) {
        out = '0' + out;
    }
    out = '(#' + this.gid + out + ')\t' + this.message;
    this.message = out;
    const pe = new PrettyError();
    return pe.render(this.stack);
};
InternalError.prototype.is = function (errNumber) {
    const error = this.errorCodes[errNumber];
    return (this.gid == error.gid) &&
        (this.id == error.id) &&
        (this.message == error.message);
};

module.exports = InternalError;