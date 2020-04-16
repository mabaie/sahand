'use strict';
const GalleryModel = require("../../../Models/gallery").GalleryModel;
const ExternalError = require('../../../Models/Error/External');
const ObjectID = require("mongodb").ObjectID;

module.exports = async function(req, res, next){
    const schoolID = req.params.id;
    const _id = req.data._id;
    console.log("my id:",_id);
    let gallery=[];
    try {
        gallery = await GalleryModel.find(
            { school_id: new ObjectID(schoolID),owner:"manager" },
            0,
            10000
        );
        let gallery2 = await GalleryModel.find(
                { school_id: new ObjectID(schoolID), teacher_id: new ObjectID(_id),owner:"teacher"},
                0,
                10000
            );
        gallery = gallery.concat(gallery2);
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