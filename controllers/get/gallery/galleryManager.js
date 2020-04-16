"use strict";
const GalleryModel = require("../../../Models/gallery").GalleryModel;
const ObjectID = require("mongodb").ObjectID;

module.exports = async (req, res, next) => {
  const body = req.body.valid.value;
  console.log(req.data._id);
  try {
    const gallery = (body.hasOwnProperty("filter") && body.filter.hasOwnProperty("tag")) ? await GalleryModel.find(
      { school_id: new ObjectID(req.data._id),owner:"manager",tag:body.filter.tag },
      body.skip,
      body.limit
    ):await GalleryModel.find(
      { school_id: new ObjectID(req.data._id),owner:"manager" },
      body.skip,
      body.limit
    );
    res.json(gallery);
  } catch (err) {
    if (err.is(2)) {
      res.json([]);
    } else {
      next(new ExternalError(25));
    }
  }
};
