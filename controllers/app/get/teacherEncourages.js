"use strict";
const EncourageModel = require("../../../Models/encourage").EncourageModel;
const ObjectID = require("mongodb").ObjectID;

module.exports = async (req, res, next) => {
  try {
    console.log("schoolID is",req.params.school_id)
    const encourages = await EncourageModel.find(
      { school_id: new ObjectID(req.params.school_id) },
      0,
      100,
      { title: 1 }
    );
    res.json(encourages);
  } catch (err) {
    return next(err);
  }
};
