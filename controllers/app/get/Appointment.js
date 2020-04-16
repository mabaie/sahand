"use strict";
const SettingAppointmentModel = require("../../../Models/settingAppointment").SettingAppointmentModel;
const CourseModel = require("../../../Models/course").CourseModel;
const ClassModel = require("../../../Models/class").ClassModel;
const UserModel = require("../../../Models/user").UserModel;
const ObjectID = require("mongodb").ObjectID;
const jMoment = require("moment-jalaali");
module.exports = async (req, res, next) => {
  try{
    const school_id = new ObjectID(req.data._id);
    const st_id = req.params.id
    const now = new Date(parseInt(req.params.date));
    console.log(now)
    let year = jMoment(new Date);
    if(year.jMonth() <= 4 && year.jMonth() >0){
        year.subtract(1, 'jYear');
    }
    year = new Date(year.startOf('jYear').toISOString());
    let courses = await CourseModel.find({students: st_id}, 0, 100000, {periods: 1, coname: 1, class_id: 1,teacher_id:1});
    
    await Promise.all(courses.map((course,idx)=>{
        return ClassModel.find({_id: course.class_id}, 0, 100000).then(classe=>{
            const courseDate = new Date(classe[0]['year']);
            console.log('course 11: ',course);
            if(courseDate.getTime() !== year.getTime()) {
                courses = courses.splice(idx, 1);
            }
        })
    }));
    let teachers= await courses.map(cour=>{return cour.teacher_id})
    console.log('course: ',courses,st_id,teachers);
    const m = jMoment(now);
    const month_sets = new Date(m.startOf('jMonth').format("YYYY-MM-DD"));
    let out = await SettingAppointmentModel.find(
      { school_id: school_id, month_sets:month_sets},0,10000
    );
    console.log('output is: ',out)
    out=out.filter(t=>{
      return teachers.findIndex(f=>{
        return f.toString().valueOf() === t.teacher_id.toString().valueOf()
      })>=0
    })
    console.log('output is2: ',out)
    await Promise.all(out.map(async (app)=>{
      const teacher = await UserModel.find({_id:app.teacher_id},0,1);
      app['fname'] = teacher[0].fname;
      app['lname'] = teacher[0].lname;
      console.log(app);
      app.appointments = app.appointments.filter(schedule=>{
        return !schedule.hasOwnProperty('cid') || st_id == schedule.cid
      });
    }))
    res.json(out);
  }catch(err){
    let out=[];
    res.json(out);
  }
};
