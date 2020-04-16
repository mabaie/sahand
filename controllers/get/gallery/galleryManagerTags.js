"use strict";
const GalleryModel = require("../../../Models/gallery").GalleryModel;
const ObjectID = require("mongodb").ObjectID;

module.exports = async (req, res, next) => {
  console.log(req.data._id);
  const gallery = await GalleryModel.find(
    { school_id: new ObjectID(req.data._id),owner:"manager" },
    0,10000
  );
  let tags=[];
  for(let i=0; i<gallery.length;i++){
    if(tags.findIndex(function(element){
      return element === gallery[i].tag;
    })<0){
      tags.push(gallery[i].tag)
    }
  }
  res.json(tags);
};
