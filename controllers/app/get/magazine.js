"use strict";
const MagazineModel = require("../../../Models/magazine").MagazineModel;
const ObjectID = require("mongodb").ObjectID;

module.exports = async (req, res, next) => {
  console.log('request date',req.params.news_id);
  try {
    const magazine = await MagazineModel.findOne(
      { _id: new ObjectID(req.params.id) }
    );
    res.json(magazine[0]);
  } catch (err) {
    if (err.is(2)) {
      res.json([]);
    } else {
      next(new ExternalError(25));
    }
  }
};
