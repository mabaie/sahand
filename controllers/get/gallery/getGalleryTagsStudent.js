'use strict';
const CourseModel = require('../../../Models/course').CourseModel;
const GalleryModel = require("../../../Models/gallery").GalleryModel;
const ExternalError = require('../../../Models/Error/External');
const ObjectID = require("mongodb").ObjectID;

module.exports = async function(req, res, next){
    const studentID = req.params.id;
    let courses = await CourseModel.find({students: studentID}, 0, 100000, {periods: 1, coname: 1, class_id: 1});
    let gallery=[];
    try {
        gallery = await GalleryModel.find(
            { school_id: new ObjectID(req.data._id),owner:"manager" },
            0,
            10000
        );
        let gallery2 = await Promise.all(courses.map((course)=>{
            return GalleryModel.find(
                { course_id: new ObjectID(course._id),owner:"teacher", "accepted": true},
                0,
                10000
            );
        }));
        for(let x in gallery2){
            gallery = gallery.concat(gallery2[x]);
        }
        let tags=[];
        for(let i=0; i<gallery.length;i++){
            if(tags.findIndex(function(element){
            return element === gallery[i].tag;
            })<0){
            tags.push(gallery[i].tag)
            }
        }
        res.json(tags);
    } catch (err) {
        console.log("error is : ",err)
        if (err.is(2)) {
            res.json([]);
        } else {
            next(new ExternalError(25));
        }
    }
}