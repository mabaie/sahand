"use strict";
const AssignmentModel = require("../../../Models/assignment").AssignmentModel;
const ObjectID = require("mongodb").ObjectID;
const ExternalError = require("../../../Models/Error/External");

module.exports = async (req, res, next) => {
  try {
    const courseID = req.params.courseID;
    const assignments = await AssignmentModel.find(
      { courseID: new ObjectID(courseID) },
      0,
      10000
    );
    res.json(assignments);
  } catch (err) {
    if (err.is(2)) {
      return next(new ExternalError(25));
    }
  }
};
