"use strict";
const SettingAppointmentModel = require("../../Models/settingAppointment").SettingAppointmentModel;
const UserModel = require("../../Models/user").UserModel;
const ObjectID = require("mongodb").ObjectID;
const jmoment = require("moment-jalaali");
module.exports = async (req, res, next) => {
  const school_id = new ObjectID(req.data._id);
  const now = new Date(parseInt(req.params.date));
  console.log(now)
  const m = jmoment(now);
  const month_sets = new Date(m.startOf('jMonth').format("YYYY-MM-DD"));
  let out = await SettingAppointmentModel.find(
    { school_id: school_id,month_sets:month_sets },0,10000
  );
  await Promise.all(out.map(async (app)=>{
    const teacher = await UserModel.find({_id:app.teacher_id},0,1);
    app['fname'] = teacher[0].fname;
    app['lname'] = teacher[0].lname;
    await Promise.all(app.appointments.map(async (schedule)=>{
      if(schedule.hasOwnProperty('cid')){
        console.log(schedule)
        const parent = await UserModel.find({_id:schedule.pid},0,1);
        schedule['pfname'] = parent[0].fname;
        schedule['plname'] = parent[0].lname;
        const chiled = await UserModel.find({_id:schedule.cid},0,1);
        schedule['cfname'] = chiled[0].fname;
        schedule['clname'] = chiled[0].lname;
        console.log(schedule)
        delete schedule.cid;
        delete schedule.pid;
      }
    }))
  }))
  res.json(out);
};
