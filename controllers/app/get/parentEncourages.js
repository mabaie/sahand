"use strict";
const ObjectID = require("mongodb").ObjectID;
const EncourageModel = require("../../../Models/encourage").EncourageModel;
const CourseModel = require('../../../Models/course').CourseModel;
module.exports = async (req, res, next) => {
  try {
    const body = req.body.valid.value;
    const { studentID, courseID } = body;
    const encourages = await EncourageModel.find(
      {

      },
      0,
      100000,
      {
        "encourages":{"$elemMatch":{
          "studentID": new ObjectID(studentID),
          "courseID": new ObjectID(courseID)
      }},title:1}
    );
    console.log('encourages: ',encourages);
    await Promise.all(encourages.map(async encourage=>{
      if(encourage.hasOwnProperty('encourages')){
        return Promise.all(encourage.encourages.map(async encourage=>{
            delete encourage.studentID;
            const courseID = encourage.courseID;
            delete encourage.courseID;
            return CourseModel.findOne({_id: new ObjectID(courseID)}).then((res)=>{encourage.coname = res[0].coname})
        }))
      }else{
        return;
      }
    }))
    console.log('encourages: ',encourages)
    res.json(encourages);
  } catch (err) {
    console.log(err);
  }
};
