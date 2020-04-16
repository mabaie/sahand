'use strict';
const GradesModel = require('../../Models/grade_school').GradesModel;
const ExternalError = require('../../Models/Error/External');
const ObjectID = require('mongodb').ObjectID;

async function getGradeController(req, res, next) {
    try {
        let gradeList = await GradesModel.find({school_id: new ObjectID(req.data._id)}, 0, 100000, {coname: 1, periods: 1});
        let arr=[];
        for(g in gradeList){
            arr.push(gradeList[g].name)
        }
        res.json(arr);
     } catch (err) {
        
        if (err.is(2)) {
            res.json([]);
        } else {
            next(new ExternalError(25));
        }
    }
}

module.exports = getGradeController;