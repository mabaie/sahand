"use strict";
const ObjectID = require("mongodb").ObjectID;
const CalendarEventModel = require("../../Models/event").CalendarEventModel;

module.exports = async (req, res, next) => {
  try {
    const body = req.body.valid.value;
    const id = new ObjectID(req.params.id);
    await CalendarEventModel.findOneAndUpdate(
      { _id: id },
      {$pull: {events: body.event}},
      { upsert: false }
    );
    res.json(body);
  } catch (err) {
    next(err);
  }
};
