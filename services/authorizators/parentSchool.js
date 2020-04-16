'use strict';
module.exports = async function(req, res, next) {
    req.data._id = req.params.id; 
    next();    
}