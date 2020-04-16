"use strict";
const jMoment = require("moment-jalaali");
const CalendarEventModel = require("../../Models/event").CalendarEventModel;
const ObjectID = require("mongodb").ObjectID;

module.exports = async (req, res, next) => {
  try {
    const date = new Date(parseInt(req.params.date));
    const school_id = new ObjectID(req.data._id);
    const start = jMoment(date).startOf("jMonth");
    const end = jMoment(date)
      .add("jMonth", 1)
      .startOf("jMonth");
    const events = await CalendarEventModel.find(
      {
        school_id: school_id,
        date: { $gte: start.toDate(), $lt: end.toDate() }
      },
      0,
      10000000,
      { date: 1, events: 1 }
    );
    res.json(events ? events: []);
  } catch (err) {
    next(err);
  }
};
