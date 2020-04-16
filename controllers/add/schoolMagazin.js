"use strict";
const Magazine = require("../../Models/magazine").Magazine;
const ObjectID = require("mongodb").ObjectID;

module.exports = async (req, res, next) => {
  const body = req.body.valid.value;
  try {
    const newMagazine = new Magazine({
      modified_at: new Date(),
      posted_at: new Date(),
      title: body.Title,
      description: body.Description,
      attachment:body.Attachment,
      school_id: new ObjectID(req.data._id)
    });
    await newMagazine.save();
    res.json({ success: 1 });
  } catch (err) {
    throw err;
  }
};
