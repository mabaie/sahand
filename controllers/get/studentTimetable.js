'use strict';
const CourseModel = require('../../Models/course').CourseModel;
const ClassModel = require('../../Models/class').ClassModel;
const jMoment = require('moment-jalaali');

module.exports = async function(req, res, next){
    let year = jMoment(new Date);
    if(year.jMonth() <= 4 && year.jMonth() >0){
        year.subtract(1, 'jYear');
    }
    year = new Date(year.startOf('jYear').toISOString());
    const studentID = req.params.id;
    let courses = await CourseModel.find({students: studentID}, 0, 100000, {periods: 1, coname: 1, class_id: 1});
    await Promise.all(courses.map((course,idx)=>{
        return ClassModel.find({_id: course.class_id}, 0, 100000).then(classe=>{
            const courseDate = new Date(classe[0]['year']);
            delete course.class_id;
            if(courseDate.getTime() !== year.getTime()) {
                courses = courses.splice(idx, 1);
            } 
        })
    }));
    res.json(courses);
}