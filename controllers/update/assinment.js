"use strict";
const AssignmentModel = require("../../Models/assignment").AssignmentModel;
const ObjectID = require("mongodb").ObjectID;
const ExternalError = require("../../Models/Error/External");
const configs = require("../../configs");
module.exports = async (req, res, next) => {
  console.log("my id",req.params.courseID)
  const body = req.body;
  try {
    await AssignmentModel.findOneAndUpdate(
      { _id: new ObjectID(req.params.courseID) },
      (body.hasOwnProperty('assignment'))?{
        $set: 
        {
          title: body.title, description: body.description, assignment:body.assignment,deadline: new Date(body.deadline) 
        },
        $currentDate: { date: true }
      }:{
        $set: 
        {
          title: body.title, description: body.description, deadline: new Date(body.deadline) 
        },
        $unset:{assignment:1},
        $currentDate: { date: true }
      },
      { upsert: false }
    );
    res.json({ success: 1 });
  } catch (err) {
    console.log(err);
    if (err.is(2)) {
      return next(new ExternalError(25));
    }
    return next(err);
  }
};
