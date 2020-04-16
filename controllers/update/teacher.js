'use strict';
const UserModel = require('../../Models/user').UserModel;
const ProfileModel = require('../../Models/profile').ProfileModel;
const TeacherModel = require('../../Models/teacher').TeacherModel;
const buildQuery = require('../../services/buildQuery');
const ExternalError = require('../../Models/Error/External');
const ObjectId = require('mongodb').ObjectId;
const Promise = global.Promise;

module.exports = async function updateManagerController(req, res, next) {
    const body = req.body.valid.value;
    console.log(req.params.id);
    const teacherUpdateRecord = buildQuery(body);
    if (buildQuery(body).haddress) {
        teacherUpdateRecord[`${new ObjectId(req.data._id)}.haddress`] = buildQuery(body).haddress;
    }
    Promise.all([UserModel.findOneAndUpdate({
        _id: new ObjectId(req.params.id),
    }, {
        $set: buildQuery(body),
        $currentDate: {
            last_modified: true
        },
    }, {
        upsert: false,
    }), ProfileModel.findOneAndUpdate({
        _id: new ObjectId(req.params.id),
    }, {
        $set: buildQuery(body),
        $currentDate: {
            last_modified: true
        },
    }, {
        upsert: false,
    })
    , TeacherModel.findOneAndUpdate({
        _id: new ObjectId(req.params.id),
    }, {
        $set: teacherUpdateRecord,
        $currentDate: {
            last_modified: true
        },
    }, {
        upsert: false,
    })
    ]).then(() => {
        return next(new ExternalError(31));
    }).catch((err) => {        
        if (err.is(2)) {
            return next(new ExternalError(21));
        } else {
            throw err;
        }
    });
};