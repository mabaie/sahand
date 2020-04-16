'use strict';
const CourseModel = require('../../Models/course').CourseModel;
const ExternalError = require('../../Models/Error/External');
const ClassModel = require('../../Models/class').ClassModel;
const ObjectID = require('mongodb').ObjectID;
const UserModel = require('../../Models/user').UserModel;

async function getCoursesController(req, res, next) {
    const body = req.body.valid.value;
    try {
        let courses=[];
        if(!body.hasOwnProperty('filter') || !body.filter.hasOwnProperty('classID') ||
            (
                body.hasOwnProperty('filter') && body.filter.hasOwnProperty('classID') && 
                body.filter.classID.toString()==='default'
            )
        ){
            const classes = await ClassModel.find({school_id: new ObjectID(req.data._id)}, body.skip, body.limit, {cname: 1, grade: 1, year: 1});
            courses = await Promise.all(classes.map(classe=>{
                return CourseModel.find({class_id: new ObjectID(classe._id)},0, 100000);
            }));
        }else{
            console.log("filter is: ",body.filter)
            courses = await CourseModel.find({class_id: new ObjectID(body.filter.classID)},0, 100000);
            console.log("course is: ",courses)
        }
        
        courses = [].concat.apply([], courses);
        await Promise.all(courses.map(course=>{
            return Promise.all([UserModel.findOne({_id: new ObjectID(course.teacher_id)}, body.skip, body.limit).then(teacher=>{
                delete course.teacher_id;
                course['tfname'] = teacher[0].fname;
                course['tlname'] = teacher[0].lname;
            }), ClassModel.findOne({_id: new ObjectID(course.class_id)}, body.skip, body.limit).then(classe=>{
                course['cname'] = classe[0]['cname'];
                course['year'] = classe[0]['year'];
                course['grade'] = classe[0]['grade'];
            })])
        }));
        res.json(courses);
        

        // let courses = await CourseModel.find({}, body.skip, body.limit);
        // courses = await Promise.all(courses.map(async course=>{
        //     const classe = await ClassModel.findOne({_id: new ObjectID(course.class_id)}, body.skip, body.limit);
        //     delete course.modified_at;
        //     course['cname'] = classe[0].cname;
        //     course['grade'] = classe[0].grade;
        //     course['year'] = classe[0].year;
        //     return course;
        // }));
        // courses = await Promise.all(courses.map(async course=>{
        //     const teacher = await UserModel.findOne({_id: new ObjectID(course.teacher_id)}, body.skip, body.limit);
        //     delete course.teacher_id;
        //     course['tfname'] = teacher[0].fname;
        //     course['tlname'] = teacher[0].lname;
        //     return course;
        // }));
        // console.log(courses);
        //res.json(courses);
    } catch (err) {
        console.log(err);
        if (err.is(2)) {
            res.json([]);
        } else {
            next(new ExternalError(25));
        }
    }
}

module.exports = getCoursesController;