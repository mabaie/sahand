"use strict";
const GalleryModel = require("../../../Models/gallery").GalleryModel;
const TeacherModel = require("../../../Models/user").UserModel;
const ObjectID = require("mongodb").ObjectID;

module.exports = async (req, res, next) => {
  const gallery = await GalleryModel.find(
    { school_id: new ObjectID(req.data._id),owner:"teacher" },
    0,10000
  );
  let teacher=[];
  for(let i=0; i<gallery.length;i++){
    if(teacher.findIndex(function(element){
      return element.toString() === gallery[i].teacher_id.toString();
    })<0 ){
      teacher.push(gallery[i].teacher_id)
    }
  }
  console.log(teacher)
  let list=[];
  await Promise.all(teacher.map(element=>{
    return Promise.all([ TeacherModel.findOne({_id: new ObjectID(element)}, 0, 10).then(user=>{
      list.push({teacherID:user[0]._id,teacherName:user[0].fname + " " + user[0].lname});
    })])
  }));
  res.json(list);
};
