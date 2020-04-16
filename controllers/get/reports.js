"use strict";
const ReportModel = require("../../Models/report").ReportModel;
const ObjectID = require("mongodb").ObjectID;

module.exports = async (req, res, next) => {
  const body = req.body.valid.value;
  console.log(req.data._id,body);
  try {
    const Reports = await ReportModel.find(
      { school_id: new ObjectID(req.data._id) },
      body.skip,
      body.limit
    );
    res.json(Reports);
  } catch (err) {
    if (err.is(2)) {
      res.json([]);
    } else {
      next(new ExternalError(25));
    }
  }
};
