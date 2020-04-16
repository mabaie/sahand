"use strict";
const GalleryModel = require("../../../Models/gallery").GalleryModel;
const TeacherModel = require("../../../Models/user").UserModel;
const CourseModel = require("../../../Models/course").CourseModel;
const ObjectID = require("mongodb").ObjectID;

module.exports = async (req, res, next) => {
  const body = req.body.valid.value;
  console.log(req.data._id);
  try {
    const gallery = (body.hasOwnProperty("filter") && body.filter.hasOwnProperty("tag"))? await GalleryModel.find(
      { school_id: new ObjectID(req.data._id),owner:"teacher",tag:body.filter.tag },
      body.skip,
      body.limit
    ):(body.hasOwnProperty("filter") && body.filter.hasOwnProperty("courseID"))? await GalleryModel.find(
      { school_id: new ObjectID(req.data._id),owner:"teacher",course_id:new ObjectID(body.filter.courseID) },
      body.skip,
      body.limit
    ):(body.hasOwnProperty("filter") && body.filter.hasOwnProperty("teacherID"))? await GalleryModel.find(
      { school_id: new ObjectID(req.data._id),owner:"teacher",teacher_id:new ObjectID(body.filter.teacherID) },
      body.skip,
      body.limit
    ):await GalleryModel.find(
      { school_id: new ObjectID(req.data._id),owner:"teacher"},
      body.skip,
      body.limit
    );
    await Promise.all(gallery.map(image=>{
      return Promise.all([TeacherModel.findOne({_id: new ObjectID(image.teacher_id)}, 0, 10).then(teacher=>{
        image['teachername'] = teacher[0].fname + ' ' + teacher[0].lname;
      }), CourseModel.findOne({_id: new ObjectID(image.course_id)}, 0, 10).then(course=>{
          image['coname'] = course[0].coname;
      }),GalleryModel.findOneAndUpdate({
        _id: new ObjectID(image._id)},{
        $set: {newimg:false},
        $currentDate: { modified_at: true }
      },
      { upsert: false })
    ])
    }));
    res.json(gallery);
  } catch (err) {
    if (err.is(2)) {
      res.json([]);
    } else {
      next(new ExternalError(25));
    }
  }
};
