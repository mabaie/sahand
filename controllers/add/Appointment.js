"use strict";
const SettingAppointmentModel = require("../../Models/settingAppointment").SettingAppointmentModel;
const SettingAppointment = require("../../Models/settingAppointment").SettingAppointment
const ObjectID = require("mongodb").ObjectID;
const jmoment = require("moment-jalaali");
module.exports = async (req, res, next) => {
  try {
    const teacher_id = new ObjectID(req.body.valid.value.teacherID);
    const appointments = req.body.valid.value.appointments;
    const school_id = new ObjectID(req.data._id);
    const now = new Date(appointments[0].start);
    const m = jmoment(now);
    const month_sets = new Date(m.startOf('jMonth').format("YYYY-MM-DD"));
    try{
      await SettingAppointmentModel.findOneAndUpdate(
        { school_id: school_id, teacher_id: teacher_id,month_sets:month_sets },
        {$addToSet: {appointments: {$each: appointments}}},
        { upsert: true }
      );
    }catch(err){
      const addObj = new SettingAppointment({
        school_id: new ObjectID(school_id),
        teacher_id: new ObjectID(teacher_id),
        month_sets:month_sets,
        appointments: appointments
      });
      await addObj.save();
    }
    res.json({scuccess: 1});
  } catch (err) {
    return next(err);
  }
};
