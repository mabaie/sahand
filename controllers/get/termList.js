'use strict';
const TermModel = require('../../Models/term').TermModel;
const ExternalError = require('../../Models/Error/External');
const ObjectID = require('mongodb').ObjectID;

async function getTermController(req, res, next) {
    try {
        let termList = await TermModel.find({school_id: new ObjectID(req.data._id)}, 0, 100000);
        res.json(termList);
     } catch (err) {
        
        if (err.is(2)) {
            res.json([]);
        } else {
            next(new ExternalError(25));
        }
    }
}

module.exports = getTermController;