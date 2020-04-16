"use strict";
const SchoolModel = require("../../Models/school").SchoolModel;
const configs = require('../../configs');
const ObjectID = require('mongodb').ObjectID;

module.exports = async function(req, res, next) {
  let school = await SchoolModel.findOne({ _id: new ObjectID(req.data._id) });
  school = school[0];
  let response = {
    name: school.sname,
    about: school.about ? school.about: {},
    avatar: school.avatar ? school.avatar: configs.imageUploadUrl + "schools/avatar/imagePlaceHolder.jpg"
  };
  res.json(response);
};
