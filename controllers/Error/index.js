'use strict';
function errorHandler(err, req, res, next) {
    const status = err.status;

    delete err.status;
    
    if (err && status) {
        res.status(status).json(err);
        res.end();
    }
    next(err);
}
module.exports = errorHandler;