"use strict";
const AssignmentModel = require("../../../Models/assignment").AssignmentModel;
const configs = require("../../../configs");
const ObjectID = require("mongodb").ObjectID;

module.exports = async function(req, res, next) {
  try {
    const body = req.body;
    AssignmentModel.findOneAndUpdate(
      { courseID: new ObjectID(req.params.courseID), date: new Date() },
      {
        $set:(body.hasOwnProperty('assignment'))? {
          assignment: body.assignment,
          description: body.description,
          deadline: new Date(body.deadline),
          courseID: new ObjectID(req.params.courseID),
          date: new Date(),
          title: body.title
        }:{
          description: body.description,
          deadline: new Date(body.deadline),
          courseID: new ObjectID(req.params.courseID),
          date: new Date(),
          title: body.title
        }
      },
      { upsert: true }
    );
    res.json({ success: 1 });
  } catch (err) {
    console.log(err);
    if (err.is(2)) {
      return next(new ExternalError(25));
    }
    next(err);
  }
};
