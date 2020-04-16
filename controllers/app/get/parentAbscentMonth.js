'use strict';
const ObjectID = require('mongodb').ObjectID;
const CourseModel = require('../../../Models/course').CourseModel;
const ChildrenModel = require('../../../Models/children').ChildrenModel;
const InternalError = require('../../../Models/Error/Internal');
const ExternalError = require('../../../Models/Error/External');
const moment = require('moment-jalaali');

module.exports = async function (req, res, next) {
    const studentID = new ObjectID(req.params.id);
    const parentID = new ObjectID(req.data._id);
    const date = moment(req.params.date);
    try {
        // check if parrent and child matches
        await ChildrenModel.findOne({
            _id: studentID,
            $or: [{
                parentOne: parentID
            }, {
                parentTwo: parentID
            }]
        }).catch(err => {
            if (err instanceof InternalError) {
                if (err.is(2)) {
                    throw new InternalError(10);
                } else {
                    throw err;
                }
            } else {
                throw err;
            }
        });
        const courses = await CourseModel.find({students: studentID.toString()}, 0, 1000000);
        let out = {};
        courses.forEach(course => {
            for (let session in course.attendance){
                let sessionDate = moment(session);
                if(sessionDate.jMonth() === date.jMonth()){
                    course.attendance[session].forEach(el=>{
                        if(el.present.indexOf(studentID.toString()) === -1){
                            const dateToday = sessionDate.startOf('jDay');
                            if(!out[dateToday.toISOString()]){
                                out[dateToday.toISOString()] = 0;
                            }
                            out[dateToday.toISOString()]++;
                        }
                    })
                    
                }
            }
        });
        res.json(out);
    } catch (err) {
        console.log(err);
        if (err instanceof InternalError) {
            if (err.is(10)) {
                return next(new ExternalError(104));
            }  else if(err.is(2)){
                return next(new ExternalError(25));
            } else {
                return next(new Error());
            }
        } else {
            return next(new Error());
        }
    }
}