"use strict";
const HomeActivityModel = require("../../Models/homeActivity").HomeActivityModel;
const ObjectID = require("mongodb").ObjectID;

module.exports = async (req, res, next) => {
  try {
    const report = await HomeActivityModel.find(
      { school_id: new ObjectID(req.data._id) },
      0,
      100,
      { title: 1,type: 1 }
    );
    res.json(report);
  } catch (err) {
    return next(err);
  }
};
