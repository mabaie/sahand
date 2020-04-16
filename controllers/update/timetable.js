'use strict';
const CourseModel = require('../../Models/course').CourseModel;
const ObjectId = require('mongodb').ObjectId;
const ExternalError = require('../../Models/Error/External');

module.exports = async function updateTimetableController(req, res, next) {
    const body = req.body;
    CourseModel.findOneAndUpdate({ _id: new ObjectId(req.params.id) }, { $set: { periods: body } }, { $upsert: false }).then(() => {
        res.json({});
        next();
    }).catch(err => {
        return next(new ExternalError(13))
    })

}