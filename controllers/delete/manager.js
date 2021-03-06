'use strict';
const UserModel = require('../../Models/user').UserModel;
const ProfileModel = require('../../Models/profile').ProfileModel;
const SchoolModel = require('../../Models/school').SchoolModel;

const ExternalError = require('../../Models/Error/External');
const ObjectId = require('mongodb').ObjectID;
const Promise = global.Promise;

async function deleteManager(req, res, next) {
    const _ids = req.body.valid.value.ids;
    await Promise.all(_ids.map(async id => {
        await UserModel.delete({
            _id: new ObjectId(id)
        });
        await ProfileModel.delete({
            _id: new ObjectId(id)
        });
        await SchoolModel.delete({
            _id: new ObjectId(id)
        }); 
    })).catch((err) => {
        if (err.is(2)) {
            return next(new ExternalError(21))
        } else {
            throw err;
        }
    })
    return next(new ExternalError(35));
}
module.exports = deleteManager;