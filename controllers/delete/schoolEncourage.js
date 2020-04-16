"use strict";
const EncourageModel = require("../../Models/encourage").EncourageModel;
const ObjectID = require("mongodb").ObjectID;

module.exports = async (req, res, next) => {
  try {
    const id = new ObjectID(req.params.id);
    await EncourageModel.delete({ _id: id });
    res.json({ success: 1 });
  } catch (err) {
    return next(err);
  }
};
