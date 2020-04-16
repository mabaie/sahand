"use strict";
const HomeActivityModel = require("../../../Models/homeActivity").HomeActivityModel;
const ObjectID = require("mongodb").ObjectID;

module.exports = async (req, res, next) => {
  try {
    let now=new Date();
    now = new Date(now.toISOString().substr(0,10));
    console.log(now.toISOString())
    let report = await HomeActivityModel.find(
      { school_id: new ObjectID(req.data._id) },
      0,
      100,{
        "report":{"$elemMatch":{
          "date": now,
          "student_id":new ObjectID(req.params.id)
      }},_id:1,title:1,type:1}
    );
    report = report.map(r=>{
      if(r.hasOwnProperty("report")){
        r["content"]=r.report[0].content
        delete r.report;
      }
      return r;
    })
    console.log('report is:',report)
    res.json(report);
  } catch (err) {
    return next(err);
  }
};
