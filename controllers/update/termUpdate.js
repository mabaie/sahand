"use strict";
const TermModel = require("../../Models/term").TermModel;
const ObjectID = require("mongodb").ObjectID;

module.exports = async (req, res, next) => {
  const body = req.body.valid.value;
  try {
    TermModel.findOneAndUpdate({
      _id: new ObjectID(body.ID)
    }, {
      $set: { title: body.Title},
      $currentDate: { last_modify: true }
    }, {
        upsert: false,
    });
    res.json({ success: 1 });
  } catch (err) {
    throw err;
  }
};