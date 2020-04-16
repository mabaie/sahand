"use strict";
const CalendarEventModel = require("../../Models/event").CalendarEventModel;
const ObjectID = require("mongodb").ObjectID;
const moment = require('moment');
module.exports = async function(req, res, next) {
  const body = req.body.valid.value;
  const school_id = req.data._id;
  const date = moment(body.date).startOf('Day').toDate();
  console.log(date);
  CalendarEventModel.findOneAndUpdate(
    { school_id: new ObjectID(school_id), date: date },
    {
      $addToSet: { events: body.event },
      $set: { school_id: new ObjectID(school_id), date: date }
    },
    { upsert: true }
  )
    .then(() => {
      res.json({ success: 1 });
    })
    .catch(err => {
      if (err.is(2)) next(err);
    });
};
