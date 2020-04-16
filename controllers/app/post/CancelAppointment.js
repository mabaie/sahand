"use strict";
const SettingAppointmentModel = require("../../../Models/settingAppointment").SettingAppointmentModel;
const ObjectID = require("mongodb").ObjectID;
module.exports = async (req, res, next) => {
  const _id = new ObjectID(req.data._id);
  const body = req.body.valid.value;
  console.log('body is',body)
  try{
    await SettingAppointmentModel.findOneAndUpdate(
      { _id: new ObjectID(body.appointmentID), 
        appointments: {
          start: body.start,
          end: body.end,
          cid:new ObjectID(body.studentID),
          pid:_id
        } },
      { $set: { "appointments.$" : {
        start: body.start, 
        end: body.end
      } } },
      {upsert:true}
    );
    res.json({ success: 1 });
  }catch(err){
    console.log(err);
    if (err.is(2)) {
      return next(new ExternalError(25));
    }
    next(err)
  }
};
