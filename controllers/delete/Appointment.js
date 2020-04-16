"use strict";
const SettingAppointmentModel = require("../../Models/settingAppointment").SettingAppointmentModel;
const ObjectID = require("mongodb").ObjectID;
module.exports = async (req, res, next) => {
  try {
    const _id = new ObjectID(req.body.ID);
    const start = new Date(req.body.start);
    const end = new Date(req.body.end);
    console.log(start,end)
    await SettingAppointmentModel.findOneAndUpdate(
      { _id: _id},
      { $pull: { appointments: { start: start.toISOString() , end: end.toISOString()} } },
      { multi: true }
    );
    res.json({scuccess: 1});
  } catch (err) {
    return next(err);
  }
};
