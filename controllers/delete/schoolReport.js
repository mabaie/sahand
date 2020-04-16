"use strict";
const ReportModel = require("../../Models/report").ReportModel;
const ExternalError = require("../../Models/Error/External");
const ObjectId = require("mongodb").ObjectID;
const Promise = global.Promise;

async function deleteReport(req, res, next) {
  const _ids = req.body.valid.value.ids;

  await Promise.all(
    _ids.map(async id => {
      await ReportModel.delete({
        _id: new ObjectId(id)
      });
    })
  ).catch(err => {
    if (err.is(2)) {
      return next(new ExternalError(21));
    } else {
      throw err;
    }
  });
  return next(new ExternalError(35));
}
module.exports = deleteReport;
