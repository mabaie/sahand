"use strict";
const GalleryModel = require("../../Models/gallery").GalleryModel;
const ObjectID = require("mongodb").ObjectID;
const ExternalError = require("../../Models/Error/External");
module.exports = async (req, res, next) => {
  console.log("my id",req.params.id)
  const body = req.body.valid.value;
  try {
    let update={};
    if(body.hasOwnProperty('Tag')){
      update['tag']=body.Tag;
    }
    if(body.hasOwnProperty('Caption')){
      update['caption']=body.Caption;
    }
    if(body.hasOwnProperty('accepted')){
      update['accepted']=body.accepted;
    }
    await GalleryModel.findOneAndUpdate(
      { _id: new ObjectID(req.params.id) },
      {
        $set: update,
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
