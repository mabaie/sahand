"use strict";
const SchoolModel = require("../../Models/school").SchoolModel;
module.exports = async function(req, res, next) {
  const body = req.body.valid.value;
  try {
    let school = await SchoolModel.findOne({ _id: req.data._id });
    if (school[0]) {
      SchoolModel.findOneAndUpdate(
        { _id: req.data._id },
        {
          $set: {
            sname: body["SchoolName"],
            about: body["AboutSchool"],
        }},
        { upsert: true }
      );
      school = school[0];
      res.json({ success: 1 });
    }
  } catch (err) {
    console.log(err);
    if (err.is(2)) {
      return next(new ExternalError(25));
    }
    next(err);
  }
};
