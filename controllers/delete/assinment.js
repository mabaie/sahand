"use strict";
const AssignmentModel = require("../../Models/assignment").AssignmentModel;
const ObjectID = require("mongodb").ObjectID;
const ExternalError = require("../../Models/Error/External");
const configs = require("../../configs");
module.exports = async (req, res, next) => {
  console.log("my id",req.params.courseID)
  const body = req.body;
  try {
    await AssignmentModel.delete(
      { _id: new ObjectID(req.params.courseID) }
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
