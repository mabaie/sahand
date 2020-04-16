'use strict';
const ClassModel = require('../../Models/class').ClassModel;
const ExternalError = require('../../Models/Error/External');
const ObjectID = require('mongodb').ObjectID;

async function getClassesController(req, res, next) {
    const body = req.body.valid.value;
    console.log(req.data._id);
    try {
        const classes = await ClassModel.find({school_id: new ObjectID(req.data._id)}, body.skip, body.limit);
        console.log(classes);
        res.json(classes);
    } catch (err) {
        
        if (err.is(2)) {
            res.json([]);
        } else {
            next(new ExternalError(25));
        }
    }
}

module.exports = getClassesController;