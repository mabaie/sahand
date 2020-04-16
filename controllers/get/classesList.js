'use strict';
const ClassModel = require('../../Models/class').ClassModel;
const ExternalError = require('../../Models/Error/External');
const ObjectID = require('mongodb').ObjectID;
const jMoment = require('moment-jalaali');

async function getClassesController(req, res, next) {
    try {
        let year = jMoment(new Date);
        if (year.jMonth() < 4 && year.jMonth() >= 0) {
            year.subtract(1, 'jYear');
        }
        const classes = await ClassModel.find({
            school_id: new ObjectID(req.data._id),
            year: new Date(year.startOf('jYear').toISOString()),
        }, 0, 1000, {_id: 1, cname: 1, grade: 1, capacity: 1});
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