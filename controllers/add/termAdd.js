"use strict";
const Term = require("../../Models/term").Term;
const ObjectID = require("mongodb").ObjectID;

module.exports = async (req, res, next) => {
  const body = req.body.valid.value;
  try {
    const newTerm = new Term({
      last_modify: new Date(),
      create_date: new Date(),
      title: body.Title,
      school_id: new ObjectID(req.data._id),
      active:true
    });
    await newTerm.save();
    res.json({ success: 1 });
  } catch (err) {
    throw err;
  }
};