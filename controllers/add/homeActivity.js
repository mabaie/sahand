"use strict";
const HomeActivityModel = require("../../Models/homeActivity").HomeActivityModel;
const ObjectID = require("mongodb").ObjectID;
module.exports = async (req, res, next) => {
  try {
    const title = req.body.valid.value.title;
    const type = req.body.valid.value.type;
    const school_id = new ObjectID(req.data._id);
    await HomeActivityModel.findOneAndUpdate(
      { school_id: school_id, title: title, type:type },
      { $set: { title: title, school_id: school_id, type: type, report: []} },
      { upsert: true }
    );
    res.json({scuccess: 1});
  } catch (err) {
    return next(err);
  }
};
