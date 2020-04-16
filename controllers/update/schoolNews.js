"use strict";
const NewsModel = require("../../Models/news").NewsModel;
const ObjectID = require("mongodb").ObjectID;
const ExternalError = require("../../Models/Error/External");
module.exports = async (req, res, next) => {
  const body = req.body.valid.value;
  try {
    await NewsModel.findOneAndUpdate(
      { _id: new ObjectID(req.params.id) },
      {
        $set: { title: body.Title, news: body.News },
        $currentDate: { modified_at: true }
      },
      { upsert: false }
    );
    res.json({ success: 1 });
  } catch (err) {
    console.log(err);
    if (err.is(2)) {
      return next(new ExternalError(25));
    }
    return next(err);
  }
};
