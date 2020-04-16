'use strict'
const CourseModel = require('../../../Models/course').CourseModel;
const ClassModel = require('../../../Models/class').ClassModel;
const HomeActivityModel = require('../../../Models/homeActivity').HomeActivityModel;
const moment = require('moment');
const ObjectID = require('mongodb').ObjectID;
module.exports = async function(req, res, next){
    const courseID = req.params.courseid;
    let date = new Date(moment(new Date(parseInt(req.params.date))).toISOString().substr(0,10));
    const courseInfo = await CourseModel.find({ _id: new ObjectID(courseID) }, 0, 1,{students:1,class_id:1});
    const schoolID = (await ClassModel.find({_id:courseInfo[0].class_id},0,1))[0].school_id;
    console.log(courseInfo)
    var homeActivityList = await HomeActivityModel.find({
        school_id:schoolID
        },0,100,
        {
            "report":{"$elemMatch":{
              "date": date
          }},_id:1,title:1
        }
    );
    await Promise.all(homeActivityList.map((a)=>{
        if(a.hasOwnProperty('report')){
            a.report = a.report.filter(element=>{
                return courseInfo[0].students.find(t=>{
                    //console.log("element ",t,element.student_id,t.toString() === element.student_id.toString())
                    return t.toString() === element.student_id.toString();
                }) !== undefined
            })
        }
    }));
    res.json(homeActivityList);
}