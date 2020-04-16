'use strict';
const UserModel = require('../../Models/user').UserModel;
const CourseModel = require('../../Models/course').CourseModel;
const ClassModel = require('../../Models/class').ClassModel;
const ProfileModel = require('../../Models/profile').ProfileModel;

const ObjectID = require('mongodb').ObjectID;

async function getStudentsController(req, res, next) {
    const course = await CourseModel.findOne({
        _id: new ObjectID(req.params.id)
    });
    const classe = await ClassModel.findOne({_id: new ObjectID(course[0].class_id)}, 0, 100000);
    let cstudents = course[0].students ? course[0].students: [];
    let schoolStudents = await UserModel.find({school_id: new ObjectID(req.data._id)}, 0, 1000000);
    let students = [];
    await Promise.all(schoolStudents.map((student,idx)=>{
        return ProfileModel.findOne({_id: new ObjectID(student._id)}).then(profile=>{
            if((profile[0].grade === classe[0].grade) && (cstudents.indexOf(student._id.toString()) === -1)){
                students.push(student);
            }
        })    
    }))
    if (students) {
        res.json(students);
    } else {
        res.json([]);
    }
}

module.exports = getStudentsController;