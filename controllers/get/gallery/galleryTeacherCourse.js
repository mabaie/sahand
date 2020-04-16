"use strict";
const GalleryModel = require("../../../Models/gallery").GalleryModel;
const CourseModel = require("../../../Models/course").CourseModel;
const ObjectID = require("mongodb").ObjectID;

module.exports = async (req, res, next) => {
  const gallery = await GalleryModel.find(
    { school_id: new ObjectID(req.data._id),owner:"teacher" },
    0,10000
  );
  let course=[];
  console.log("gallery is: ",gallery)
  for(let i=0; i<gallery.length;i++){
    if(course.findIndex(function(element){
      return element.toString() === gallery[i].course_id.toString();
    })<0){
      course.push(gallery[i].course_id)
    }
  }
  let list=[];
  await Promise.all(course.map(element=>{
    return Promise.all([ CourseModel.findOne({_id: new ObjectID(element)}, 0, 10).then(course1=>{
      list.push({courseID:course1[0]._id,coname:course1[0].coname});
    })])
  }));
  res.json(list);
};
