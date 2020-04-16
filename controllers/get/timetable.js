'use strict';
const CourseModel = require('../../Models/course').CourseModel;
const ExternalError = require('../../Models/Error/External');
const ObjectID = require('mongodb').ObjectID;

async function getTimetableController(req, res, next) {
    try {
        let courses = await CourseModel.find({class_id: new ObjectID(req.params.id)}, 0, 100000, {coname: 1, periods: 1});
        
        res.json(courses);
     } catch (err) {
        
        if (err.is(2)) {
            res.json([]);
        } else {
            next(new ExternalError(25));
        }
    }
}

module.exports = getTimetableController;