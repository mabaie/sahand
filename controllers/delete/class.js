'use strict';
const ClassModel = require('../../Models/class').ClassModel;
const ExternalError = require('../../Models/Error/External');
const ObjectId = require('mongodb').ObjectID;
const Promise = global.Promise;

async function deleteClass(req, res, next) {
    
    const _ids = req.body.valid.value.ids;
    
    await Promise.all(_ids.map(async id => {
        await ClassModel.delete({
            _id: new ObjectId(id)
        })
    })).catch((err) => {
        
        if (err.is(2)) {
            return next(new ExternalError(21))
        } else {
            throw err;
        }
    })
    return next(new ExternalError(35));
}
module.exports = deleteClass;