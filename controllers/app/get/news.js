"use strict";
const NewsModel = require("../../../Models/news").NewsModel;
const ObjectID = require("mongodb").ObjectID;

module.exports = async (req, res, next) => {
  console.log('request date',req.params.news_id);
  try {
    const news = await NewsModel.findOne(
      { _id: new ObjectID(req.params.news_id) }
    );
    res.json(news[0]);
  } catch (err) {
    if (err.is(2)) {
      res.json([]);
    } else {
      next(new ExternalError(25));
    }
  }
};
