'use strict';
const UserModel = require('../../Models/user').UserModel;
const ProfileModel = require('../../Models/profile').ProfileModel;
const buildQuery = require('../../services/buildQuery');
const ExternalError = require('../../Models/Error/External');
const ObjectId = require('mongodb').ObjectId;
const Promise = global.Promise;
const buildUserStatement = require('../../services/buildUserStatement');
const buildProfileStatement = require('../../services/buildProfileStatement');
const buildParentStatement = require('../../services/buildParentStatement');
const ParentModel = require('../../Models/parent').ParentModel;

function buildUpdateStatement(fields, id){
    let userStatement = {}, profileStatement ={}, parentStatement = {};
    userStatement = buildUserStatement(fields);
    profileStatement = buildProfileStatement(fields);
    parentStatement = buildParentStatement(fields, id);
    return {user: userStatement, profile: profileStatement, parent: parentStatement};
}

module.exports = async function updateStudentController(req, res, next) {
    const body = req.body.valid.value;
    const updateStatement = buildUpdateStatement(buildQuery(body), req.data._id);
    Promise.all([UserModel.findOneAndUpdate({
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
    }), ParentModel.findOneAndUpdate({
        _id: new ObjectId(req.params.id),
    }, {
        $set: updateStatement['parent'],
        $currentDate: {
            last_modified: true
        },
    }, {
        upsert: false,
    }),]).then(() => {
        return next(new ExternalError(31));
    }).catch((err) => {
        
        if (err.is(2)) {
            return next(new ExternalError(21));
        } else {
            throw err;
        }
    });
};