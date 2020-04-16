"use strict";
const EncourageModel = require("../../Models/encourage").EncourageModel;
const ObjectID = require("mongodb").ObjectID;
module.exports = async (req, res, next) => {
  try {
    const title = req.body.valid.value.title;
    const school_id = new ObjectID(req.data._id);
    await EncourageModel.findOneAndUpdate(
      { school_id: school_id, title: title },
      { $set: { title: title, school_id: school_id, encourages: []} },
      { upsert: true }
    );
    res.json({scuccess: 1});
  } catch (err) {
    return next(err);
  }
};
