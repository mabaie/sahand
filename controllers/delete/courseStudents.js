'use strict';
const CourseModel = require('../../Models/course').CourseModel;
const ObjectID = require('mongodb').ObjectID;

async function deleteCourseSudents(req, res, next) {
    const body = req.body;
    
    await CourseModel.findOneAndUpdate({
        _id: new ObjectID(req.params.id)
    }, {
        $pullAll: {
            students: body
        }
    })
    res.json({
        ok: '1'
    });
}
module.exports = deleteCourseSudents;