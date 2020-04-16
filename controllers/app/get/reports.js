"use strict";
const ReportModel = require("../../../Models/report").ReportModel;
const ObjectID = require("mongodb").ObjectID;

module.exports = async (req, res, next) => {
  const body = req.body.valid.value;
  console.log(req.data._id);
  try {
    const reports = await ReportModel.find(
      { school_id: new ObjectID(req.data._id) },
      body.skip,
      body.limit
    );
    for(let i=0;i<reports.length;i++){
        delete reports[i].description;
    }
    res.json(reports);
  } catch (err) {
    if (err.is(2)) {
      res.json([]);
    } else {
      next(new ExternalError(25));
    }
  }
};
