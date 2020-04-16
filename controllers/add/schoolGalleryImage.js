"use strict";
const Gallery = require("../../Models/gallery").Gallery;
const ObjectID = require("mongodb").ObjectID;

module.exports = async (req, res, next) => {
  console.log(req.body.valid.value);
  const body = req.body.valid.value;
  try {
    for(let i=0;i<body.length;i++){
      const newGallery = new Gallery({
        url: body[i].url,
        tag: body[i].tag,
        caption: body[i].caption,
        owner: "manager",
        school_id: new ObjectID(req.data._id),
        posted_at: new Date(),
        modified_at: new Date(),
      });
      await newGallery.save();
    }
    res.json({ success: 1 });
  } catch (err) {
    throw err;
  }
};
