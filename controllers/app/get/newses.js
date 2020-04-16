"use strict";
const NewsModel = require("../../../Models/news").NewsModel;
const ObjectID = require("mongodb").ObjectID;

module.exports = async (req, res, next) => {
  const body = req.body.valid.value;
  console.log(req.data._id);
  try {
    const newses = await NewsModel.find(
      { school_id: new ObjectID(req.data._id) },
      body.skip,
      body.limit
    );
    for(let i=0;i<newses.length;i++){
        delete newses[i].news;
    }
    res.json(newses);
  } catch (err) {
    if (err.is(2)) {
      res.json([]);
    } else {
      next(new ExternalError(25));
    }
  }
};
