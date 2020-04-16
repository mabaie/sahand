'use strict';
const TeacherModel = require('../../Models/teacher').TeacherModel;
const ExternalError = require('../../Models/Error/External');
const ObjectId = require('mongodb').ObjectID;
const Promise = global.Promise;

async function deleteTeacher(req, res, next) {
    
    const _ids = req.body.valid.value.ids;
    
    await Promise.all(_ids.map(async id => {
        await TeacherModel.findOneAndUpdate({
            _id: new ObjectId(id)
        }, {$unset: {[new ObjectId(req.data._id)]: ""}});
    })).catch((err) => {
        
        if (err.is(2)) {
            return next(new ExternalError(21))
        } else {
            throw err;
        }
    })
    return next(new ExternalError(35));
}
module.exports = deleteTeacher;