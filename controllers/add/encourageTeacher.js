"use strict";
const EncourageModel = require("../../Models/encourage").EncourageModel;
const InternalError = require("../../Models/Error/Internal");
const ObjectID = require("mongodb").ObjectID;
const moment = require("moment");

module.exports = async (req, res, next) => {
  try {
    const body = req.body.valid.value;
    const dtemp= new Date();
    const date = new Date(dtemp.toISOString().substr(0,10));
    await EncourageModel.find({_id: new ObjectID(body.encourageID)},0,100,{
      "encourages":{"$elemMatch":{
        "studentID": new ObjectID(body.studentID),
        "courseID": new ObjectID(body.courseID),
        "date": date
    }}}).then(async (datatest) => {
      console.log("here data founded: ",datatest)
      if(datatest.length==0 || !datatest[0].hasOwnProperty("encourages")){
        throw new InternalError(2);
      }
      await EncourageModel.findOneAndUpdate(
        {
          _id: new ObjectID(body.encourageID),
          "encourages":{"$elemMatch":{
            "studentID": new ObjectID(body.studentID),
            "courseID": new ObjectID(body.courseID),
            "date": date
        }}
        },
        {
          $set: {
            "encourages.$.star": body.star,
            "encourages.$.description": body.description
          }
        },
        {
          upsert: false,
        }
      );
      console.log("found");
      res.json({ success: 1 });
    })
      .catch(async err => {
        if (err.is(2)) {
          console.log("here");
          await EncourageModel.findOneAndUpdate(
            {
              _id: new ObjectID(body.encourageID)
            },
            {
              $addToSet: {
                encourages: {
                  studentID: new ObjectID(body.studentID),
                  courseID: new ObjectID(body.courseID),
                  star: body.star,
                  description: body.description,
                  date: date
                }
              }
            },
            { upsert: false }
          );
          res.json({ success: 1 });
        } else {
          throw err;
        }
      });
  } catch (err) {
    return next(err);
  }
};
