'use strict';

const CustomError = require('../index');

function ExternalError(errNumber){
    CustomError.call(this, this.errorCodes[errNumber]);
}

ExternalError.prototype = Object.create(CustomError.prototype);
ExternalError.prototype.constructor = ExternalError;
ExternalError.prototype.errorCodes = require('./error-codes');

ExternalError.prototype.toJSON = function(){
    let out = {};
    out.errorNumber = '' + this.id;
    while(out.errorNumber.length < 2) out.errorNumber = '0' + out.errorNumber;
    out.errorNumber = this.gid + out.errorNumber;
    out.message = this.message;
    out.status = this.status;
    return out;
};

module.exports = ExternalError;