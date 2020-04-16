'use strict';
const ClassModel = require('../../Models/class').ClassModel;
const buildQuery = require('../../services/buildQuery');
const ExternalError = require('../../Models/Error/External');
const ObjectId = require('mongodb').ObjectId;
const Promise = global.Promise;

module.exports = async function updateManagerController(req, res, next) {
    const body = req.body.valid.value;
    
    Promise.all([ClassModel.findOneAndUpdate({
        _id: new ObjectId(req.params.id),
    }, {
        $set: buildQuery(body),
        $currentDate: {
            last_modified: true
        },
    }, {
        upsert: false,
    })]).then(() => {
        return next(new ExternalError(31));
    }).catch((err) => {
        
        if (err.is(2)) {
            return next(new ExternalError(21));
        } else {
            throw err;
        }
    });
};