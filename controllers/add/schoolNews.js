"use strict";
const News = require("../../Models/news").News;
const ObjectID = require("mongodb").ObjectID;

module.exports = async (req, res, next) => {
  const body = req.body.valid.value;
  try {
    const newNews = new News({
      modified_at: new Date(),
      posted_at: new Date(),
      title: body.Title,
      news: body.News,
      school_id: new ObjectID(req.data._id)
    });
    await newNews.save();
    res.json({ success: 1 });
  } catch (err) {
    throw err;
  }
};
