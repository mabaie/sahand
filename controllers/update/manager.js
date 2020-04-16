'use strict';
const UserModel = require('../../Models/user').UserModel;
const ProfileModel = require('../../Models/profile').ProfileModel;
const SchoolModel = require('../../Models/school').SchoolModel;
const buildQuery = require('../../services/buildQuery');
const ExternalError = require('../../Models/Error/External');
const ObjectId = require('mongodb').ObjectId;
const buildUserStatement = require('../../services/buildUserStatement');
const buildProfileStatement = require('../../services/buildProfileStatement');
const buildSchoolStatement = require('../../services/buildSchoolStatement');
const Promise = global.Promise;


function buildUpdateStatement(fields){
    let userStatement = {}, profileStatement ={}, schoolStatement = {};
    userStatement = buildUserStatement(fields);
    profileStatement = buildProfileStatement(fields);
    schoolStatement = buildSchoolStatement(fields);
    return {user: userStatement, profile: profileStatement, school: schoolStatement};
}
module.exports = async function updateManagerController(req, res, next) {
    const body = req.body.valid.value;
    const updateStatement = buildUpdateStatement(buildQuery(body));
    await Promise.all([UserModel.findOneAndUpdate({
        _id: new ObjectId(req.params.id),
    }, {
        $set: updateStatement['user'],
        $currentDate: {
            last_modified: true
        },
    }, {
        upsert: false,
    }), ProfileModel.findOneAndUpdate({
        _id: new ObjectId(req.params.id),
    }, {
        $set: updateStatement['profile'],
        $currentDate: {
            last_modified: true
        },
    }, {
        upsert: false,
    }), SchoolModel.findOneAndUpdate({
        _id: new ObjectId(req.params.id),
    }, {
        $set: updateStatement['school'],
        $currentDate: {
            last_modified: true
        },
    }, {
        upsert: false,
    })]).then(() => {
        return next(new ExternalError(31));
    }).catch((err) => {
        console.log(err);
        if (err.is(2)) {
            return next(new ExternalError(21));
        } else {
            throw err;
        }
    });
};