"use strict";
const SchoolModel = require("../../Models/school").SchoolModel;
const configs = require("../../configs");

module.exports = async function(req, res, next) {
  try {
    const storedPath =
      configs.uploadUrl +
      "/schools/avatar/" +
      req.file.filename;
    SchoolModel.findOneAndUpdate(
      { _id: req.data._id },
      {
        $set: {
          avatar: storedPath
        }
      },
      { upsert: true }
    );
    res.json({ url: storedPath });
  } catch (err) {
    console.log(err);
    if (err.is(2)) {
      return next(new ExternalError(25));
    }
    next(err);
  }
};
