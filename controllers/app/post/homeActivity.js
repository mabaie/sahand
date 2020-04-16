"use strict";
const HomeActivityModel = require("../../../Models/homeActivity").HomeActivityModel;
const ObjectID = require("mongodb").ObjectID;

module.exports = async function(req, res, next) {
  try {
    const body = req.body.valid.value;
    console.log(body);
    let now = new Date();
    let date = new Date(now.toISOString().substr(0,10));
    const res1=await Promise.all(body.map(async (activity)=>{
      HomeActivityModel.findOneAndUpdate({
        _id: new ObjectID(activity.id),
        "report.date": date,
        "report.student_id": new ObjectID(req.params.id)},
        {"$set": {"report.$.content": activity.content}},
        {upsert:true}).then(data=>{
          console.log('find data is: ',data)
        }).catch((err)=>{
          console.log('data not fond******************************************************');
          HomeActivityModel.findOneAndUpdate(
            { _id: new ObjectID(activity.id) },
            {$addToSet: {report: {$each: [{
              date:date,
              student_id: new ObjectID(req.params.id),
              content: activity.content
            }]}}},
            {upsert:true});
        })
    }));
    res.json({ success: 1 });
  } catch (err) {
    console.log(err);
    if (err.is(2)) {
      return next(new ExternalError(25));
    }
    next(err);
  }
};
