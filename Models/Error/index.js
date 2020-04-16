'use strict';

function CustomError(data) {
    Error.call(this);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.gid = data.gid;
    this.id = data.id; 
    this.message = data.message;
    this.status = data.status;
}

CustomError.prototype = Object.create(Error.prototype);
CustomError.prototype.constructor = CustomError;
CustomError.prototype.schema = require('./Schema');

module.exports = CustomError;