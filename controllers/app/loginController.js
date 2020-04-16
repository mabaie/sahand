'use strict'
const UserModel = require('../../Models/user').UserModel;
const TeacherModel = require('../../Models/teacher').TeacherModel;
const SchoolModel = require('../../Models/school').SchoolModel;
const CourseModel = require('../../Models/course').CourseModel;
const ClassModel = require('../../Models/class').ClassModel;
const ChildrenModel = require('../../Models/children').ChildrenModel;
const bcrypt = require('bcrypt');
const ExternalError = require('../../Models/Error/External');
const config = require('../../configs');
const jwt = require('jsonwebtoken');
const ObjectID = require('mongodb').ObjectID;
module.exports = async function (req, res, next) {
    const body = req.body.valid.value;
    UserModel.findOneAndUpdate({
        userName: body.userName,
    }, { $set: { last_login: new Date() } }).then(async (user) => {
        //check login permision
        if (!(user.canLogin)) {
            return next(new ExternalError(27))
        }
        //check password
        const matched = await bcrypt.compare(body.Password, user.pass);
        if (matched) {
            //create token and send
            const access_token = jwt.sign({
                id: user._id
            }, config.JWT_SECRET_KEY, {
                    expiresIn: '30d'
                });
            let response = {
                FirstName: user.fname,
                LastName: user.lname,
                FirstLogin: user.firstLogin,
            };
            if (user.type['teacher']) {
                response['schoolList'] = [];
                let teacherInfo = await TeacherModel.findOne({ _id: new ObjectID(user._id) }, 0, 100000);
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
                    response['schoolList'].push(schoolInfo);
                }

            }
            if (user.type['parent']) {
                let studentList = await ChildrenModel.find({ $or: [{ parentOne: new ObjectID(user._id) }, { parentTwo: new ObjectID(user._id) }] }, 0, 100000);
                studentList = await Promise.all(studentList.map(async student => {
                    delete student.parentOne;
                    delete student.parentTwo;
                    let studentInfo = await UserModel.findOne({ _id: new ObjectID(student._id) }, 0, 100000);
                    studentInfo = studentInfo[0];
                    student['firstName'] = studentInfo.fname;
                    student['lastName'] = studentInfo.lname;
                    return student;
                }));
                response['studentList'] = studentList;
            }
            res.set('Authorization', 'Bearer ' + access_token)
                .json(response);
        } else {
            return next(new ExternalError(18));
        }
    }).catch(async (err) => {
        if (err.is(2)) {
            return next(new ExternalError(18));
        } else {
            throw err;
        }
    });
}