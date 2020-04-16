'use strict';
const CourseModel = require('../../../Models/course').CourseModel;
const GalleryModel = require("../../../Models/gallery").GalleryModel;
const ExternalError = require('../../../Models/Error/External');
const ObjectID = require("mongodb").ObjectID;

module.exports = async function(req, res, next){
    const studentID = req.params.id;
    const body = req.body.valid.value;
    const courseID = (req.params.hasOwnProperty("courseID"))?req.params.courseID:null;
    let courses = await CourseModel.find({students: studentID}, 0, 100000, {periods: 1, coname: 1, class_id: 1});
    let gallery=[];
    try {
        if(courseID==null){
            gallery = (body.hasOwnProperty("filter") && body.filter.hasOwnProperty("tag")) ? await GalleryModel.find(
                { school_id: new ObjectID(req.data._id),owner:"manager",tag:body.filter.tag },
                body.skip,
                body.limit
            ):await GalleryModel.find(
                { school_id: new ObjectID(req.data._id),owner:"manager" },
                body.skip,
                body.limit
            );
            let gallery2 = await Promise.all(courses.map((course)=>{
                return (body.hasOwnProperty("filter") && body.filter.hasOwnProperty("tag")) ? GalleryModel.find(
                    { course_id: new ObjectID(course._id),owner:"teacher",tag:body.filter.tag,"accepted": true },
                    body.skip,
                    body.limit
                ): GalleryModel.find(
                    { course_id: new ObjectID(course._id),owner:"teacher", "accepted": true},
                    body.skip,
                    body.limit
                );
            }));
            for(let x in gallery2){
                gallery = gallery.concat(gallery2[x]);
            }
        }else{
            console.log("course is : ",courseID)
            gallery = (body.hasOwnProperty("filter") && body.filter.hasOwnProperty("tag")) ? await GalleryModel.find(
                { course_id: new ObjectID(courseID),owner:"teacher",tag:body.filter.tag,"accepted": true },
                body.skip,
                body.limit
            ): await  GalleryModel.find(
                { course_id: new ObjectID(courseID),owner:"teacher", "accepted": true},
                body.skip,
                body.limit
            );
        }
        res.json(gallery);
    } catch (err) {
        console.log("error is : ",err)
        if (err.is(2)) {
            res.json([]);
        } else {
            next(new ExternalError(25));
        }
    }
}