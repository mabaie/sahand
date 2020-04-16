"use strict";
const EncourageModel = require("../../Models/encourage").EncourageModel;
const ObjectID = require("mongodb").ObjectID;

module.exports = async (req, res, next) => {
  try {
    const encourages = await EncourageModel.find(
      { school_id: new ObjectID(req.data._id) },
      0,
      100,
      { title: 1 }
    );
    res.json(encourages);
  } catch (err) {
    return next(err);
  }
};
