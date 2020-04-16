'use strict';
const UserModel = require('../../Models/user').UserModel;
const TeacherModel = require('../../Models/teacher').TeacherModel;
const ExternalError = require('../../Models/Error/External');

async function getTeachersController(req, res, next) {

    try {
        const teachers = await TeacherModel.find({[req.data._id]: {$exists: true}}, 0, 1000000, {_id: 1, [req.data._id]: 1});   
        
        let users = await UserModel.find({
            _id: {
                $in: teachers.map(teacher => teacher._id)
            },
        }, 0, 1000000, {_id: 1, fname: 1, lname: 1, userName: 1}).catch(err => {
            
            if (!err.is(2)) {
                throw err;
            }
        });
        if (!users) {
            users = [];
        }
        res.json(users);
    } catch (err) {
        
        next(new ExternalError(25));
    }
}

module.exports = getTeachersController;