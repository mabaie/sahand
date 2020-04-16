"use strict";
const ReportModel = require("../../Models/report").ReportModel;
const ObjectID = require("mongodb").ObjectID;
const ExternalError = require("../../Models/Error/External");
module.exports = async (req, res, next) => {
  console.log("my id",req.params.id)
  const body = req.body.valid.value;
  try {
    await ReportModel.findOneAndUpdate(
      { _id: new ObjectID(req.params.id) },
      {
        $set: { title: body.Title, description: body.Description, attachment:body.Attachment },
        $currentDate: { modified_at: true }
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
