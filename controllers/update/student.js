'use strict';
const UserModel = require('../../Models/user').UserModel;
const ProfileModel = require('../../Models/profile').ProfileModel;
const buildQuery = require('../../services/buildQuery');
const ExternalError = require('../../Models/Error/External');
const ObjectId = require('mongodb').ObjectId;
const Promise = global.Promise;
const buildUserStatement = require('../../services/buildUserStatement');
const buildProfileStatement = require('../../services/buildProfileStatement');
const buildSchoolStatement = require('../../services/buildSchoolStatement');
const _ = require('lodash');

function buildUpdateStatement(fields){
    let userStatement = {}, profileStatement ={}, schoolStatement = {};
    userStatement = buildUserStatement(fields);
    profileStatement = buildProfileStatement(fields);
    return {user: userStatement, profile: profileStatement};
}

module.exports = async function updateStudentController(req, res, next) {
    const body = req.body.valid.value;
    console.log('body is',body)
    console.log('school id is',req.data._id);
    body['School_id'] = req.data._id;
    const updateStatement = buildUpdateStatement(buildQuery(body));
    console.log('new statement is',updateStatement)
    Promise.all([UserModel.findOneAndUpdate({
        _id: new ObjectId(req.params.id),
    }, {
        $set: updateStatement['user'],
        $currentDate: {
            last_modified: true
        },
    }, {
        upsert: false,
    }),(!updateStatement['profile'].hasOwnProperty('image')|| !_.isEqual(updateStatement['profile'].image,'null'))?
    ProfileModel.findOneAndUpdate({
        _id: new ObjectId(req.params.id),
    }, {
        $set: updateStatement['profile'],
        $currentDate: {
            last_modified: true
        },
    }, {
        upsert: false,
    }):ProfileModel.findOneAndUpdate({
        _id: new ObjectId(req.params.id),
    }, {
        $set: ()=>{
            delete updateStatement['profile'].image;
            return updateStatement['profile'];
        },
        $unset: {image:1},
        $currentDate: {
            last_modified: true
        },
    }, {
        upsert: false,
    }), ]).then(() => {
        return next(new ExternalError(31));
    }).catch((err) => {
        
        if (err.is(2)) {
            return next(new ExternalError(21));
        } else {
            throw err;
        }
    });
};