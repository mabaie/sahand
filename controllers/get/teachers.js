'use strict';
const UserModel = require('../../Models/user').UserModel;
const TeacherModel = require('../../Models/teacher').TeacherModel;
const ProfileModel = require('../../Models/profile').ProfileModel;
const ExternalError = require('../../Models/Error/External');
const _ = require('lodash');
const ObjectID = require('mongodb').ObjectID;

async function getTeachersController(req, res, next) {
    const body = req.body.valid.value;
    let filter = {
        [new ObjectID(req.data._id)]: {
            $exists: true
        },
    }
    let userIDFilter;
    if (!body.filter.hasOwnProperty("ID") || body.filter.ID === 'default') {
        userIDFilter = {
            $regex: '^.*$'
        }
    }
    else if(body.filter.hasOwnProperty("ID")){
        userIDFilter = {$regex: `^${body.filter.ID}.*$`};
    }
    let userlnameFilter;
    if (!body.filter.hasOwnProperty("lastname") || body.filter.lastname === 'default') {
        userlnameFilter = {
            $regex: '^.*$'
        }
    }
    else if(body.filter.hasOwnProperty("lastname")){
        userlnameFilter = {$regex: `^${body.filter.lastname}.*$`};
    }
    try {
        const teachers = await TeacherModel.find(filter, body.skip, body.limit);
        
        let users = await UserModel.find({
            _id: {
                $in: teachers.map(teacher => teacher._id)
            },
            userName: userIDFilter,
            lname:userlnameFilter
        }, body.skip, body.limit).catch(err => {
            
            if (!err.is(2)) {
                throw err;
            }
        });
        if (users) {
            for (let user of users) {
                delete user.pass;
                const profile = await ProfileModel.findOne({
                    _id: user._id
                });
                _.merge(user, profile[0]);
                teachers.map(teacher => {
                    if (teacher._id.toString() === user._id.toString()) {
                        const teacherInfo = teacher[req.data._id];
                        _.merge(user, teacherInfo);
                    }
                })
                delete user.modified_at;
                delete user.last_login;
                delete user.type;
                delete user.firstLogin;
                delete user.canLogin;
                delete user.isActive;
            }
        } else {
            users = [];
        }
        res.json(users);
    } catch (err) {
        
        next(new ExternalError(25));
    }
}

module.exports = getTeachersController;