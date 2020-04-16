'use strict'
const TeacherModel = require('../../../Models/teacher').TeacherModel;
const SchoolModel = require('../../../Models/school').SchoolModel;
const CourseModel = require('../../../Models/course').CourseModel;
const ClassModel = require('../../../Models/class').ClassModel;
const ObjectID = require('mongodb').ObjectID;
module.exports = async function(req, res, next){
    const teacherID = req.data._id;
    console.log(req.data._id)
    let schoolList = [];
    let teacherInfo = await TeacherModel.findOne({ _id: new ObjectID(teacherID) }, 0, 100000);
    teacherInfo = teacherInfo[0];
    delete teacherInfo._id;
    delete teacherInfo.modified_at;
    for (let school in teacherInfo) {
        let schoolInfo = { ID: school };
        let dbSchoolInfo = await SchoolModel.findOne({ _id: new ObjectID(school) }, 0, 100000);
        dbSchoolInfo = dbSchoolInfo[0];
        schoolInfo['schoolName'] = dbSchoolInfo.sname;
        let courseList = [];
        courseList = await Promise.all(teacherInfo[school].courses.map(async course => {
            let courseInfo = { ID: course };
            let dbCourseInfo = await CourseModel.findOne({ _id: new ObjectID(course) }, 0, 100000);
            dbCourseInfo = dbCourseInfo[0];
            courseInfo['name'] = dbCourseInfo.coname;
            courseInfo['periods'] = dbCourseInfo.periods;
            let dbClassInfo = await ClassModel.findOne({ _id: new ObjectID(dbCourseInfo['class_id']) });
            dbClassInfo = dbClassInfo[0];
            courseInfo['className'] = dbClassInfo['cname'];
            return courseInfo;
        }));
        schoolInfo['courseList'] = courseList;
        schoolList.push(schoolInfo);
    }
    console.log(schoolList);
    res.json(schoolList);
}