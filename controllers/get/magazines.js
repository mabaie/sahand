"use strict";
const MagazineModel = require("../../Models/magazine").MagazineModel;
const ObjectID = require("mongodb").ObjectID;

module.exports = async (req, res, next) => {
  const body = req.body.valid.value;
  console.log(req.data._id);
  try {
    const magazines = await MagazineModel.find(
      { school_id: new ObjectID(req.data._id) },
      body.skip,
      body.limit
    );
    res.json(magazines);
  } catch (err) {
    if (err.is(2)) {
      res.json([]);
    } else {
      next(new ExternalError(25));
    }
  }
};
