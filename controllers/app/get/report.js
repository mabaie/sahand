"use strict";
const ReportModel = require("../../../Models/report").ReportModel;
const ObjectID = require("mongodb").ObjectID;

module.exports = async (req, res, next) => {
  console.log('request date',req.params.news_id);
  try {
    const report = await ReportModel.findOne(
      { _id: new ObjectID(req.params.id) }
    );
    res.json(report[0]);
  } catch (err) {
    if (err.is(2)) {
      res.json([]);
    } else {
      next(new ExternalError(25));
    }
  }
};
