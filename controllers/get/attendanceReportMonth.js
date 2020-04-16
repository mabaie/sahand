'use strict';
const CourseModel = require('../../Models/course').CourseModel;
const ObjectID = require('mongodb').ObjectID;
const jMoment = require("moment-jalaali");

module.exports = async function(req, res, next){
    console.log('her')
    const courseID = req.params.course_id;
    const date = new Date(parseInt(req.params.date));
    const start = jMoment(date).startOf("jMonth");
    const end = jMoment(date)
      .add("jMonth", 1)
      .startOf("jMonth");
    const courses = await CourseModel.find({_id: new ObjectID(courseID)}, 0, 100000);
    let attendance = courses[0].attendance;
    for(let a in attendance){
        console.log(date.toISOString(),a)
        if(start.toISOString() <= a && a< end.toISOString())
            attendance[a] = courses[0].students.length - attendance[a][0].present.length;
        else
            delete attendance[a];
    }
    res.json(attendance);
}