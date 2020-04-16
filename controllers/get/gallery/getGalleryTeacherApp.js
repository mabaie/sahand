'use strict';
const GalleryModel = require("../../../Models/gallery").GalleryModel;
const ExternalError = require('../../../Models/Error/External');
const ObjectID = require("mongodb").ObjectID;

module.exports = async function(req, res, next){
    const schoolID = req.params.id;
    const _id = req.data._id;
    const body = req.body.valid.value;
    const courseID = (req.params.hasOwnProperty("courseID"))?req.params.courseID:null;
    console.log("my id:",_id);
    let gallery=[];
    try {
        if(courseID===null){
            gallery = (body.hasOwnProperty("filter") && body.filter.hasOwnProperty("tag")) ? await GalleryModel.find(
                { school_id: new ObjectID(schoolID),owner:"manager",tag:body.filter.tag },
                body.skip,
                body.limit
            ):await GalleryModel.find(
                { school_id: new ObjectID(schoolID),owner:"manager" },
                body.skip,
                body.limit
            );
            let gallery2 = (body.hasOwnProperty("filter") && body.filter.hasOwnProperty("tag")) ? await GalleryModel.find(
                    { school_id: new ObjectID(schoolID), teacher_id: new ObjectID(_id),owner:"teacher",tag:body.filter.tag},
                    body.skip,
                    body.limit
                ): await GalleryModel.find(
                    { school_id: new ObjectID(schoolID), teacher_id: new ObjectID(_id),owner:"teacher"},
                    body.skip,
                    body.limit
                );
                gallery = gallery.concat(gallery2);
        }else{
            console.log("course is : ",courseID)
            gallery = (body.hasOwnProperty("filter") && body.filter.hasOwnProperty("tag")) ? await GalleryModel.find(
                { course_id: new ObjectID(courseID),owner:"teacher",tag:body.filter.tag },
                body.skip,
                body.limit
            ): await  GalleryModel.find(
                { course_id: new ObjectID(courseID),owner:"teacher"},
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