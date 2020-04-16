'use strict'
const ObjectID = require('mongodb').ObjectID;
const ParentModel = require('../../Models/parent').ParentModel;
const UserModel = require('../../Models/user').UserModel;
const TeacherModel = require('../../Models/teacher').TeacherModel;
const External = require('../../Models/Error/External');
module.exports = async function (req, res, next) {
    const body = req.body.valid.value;
    const managerID = new ObjectID(req.data._id);
    // const parents = await findParents(managerID);
    try {
        const usersWithLname = await UserModel.find({
            lname: {
                $regex: `^${body.lname}.*`
            }
        }, 0, 10000000, {
            _id: 1,
            fname: 1,
            lname: 1
        });
        const parents = await Promise.all(usersWithLname.map(async element => {
            const parent = await ParentModel.findOne({
                _id: new ObjectID(element._id),
                [managerID]: {
                    $exists: true
                }
            }).catch(err => {
                if (err.is(2)) {
                    return undefined
                }
            });
            return parent ? element : parent;
        }));
        const teachers = await Promise.all(usersWithLname.map(async element => {
            const teacher = await TeacherModel.findOne({
                _id: new ObjectID(element._id),
                [managerID]: {
                    $exists: true
                }
            }).catch(err => {
                if (err.is(2)) {
                    return undefined
                }
            });
            return teacher ? element : teacher;
        }));
        let contacts = parents.concat(teachers);
        contacts = contacts.filter((element, i) => (element && (contacts.indexOf(element) === i)));
        res.json(contacts);
    } catch (err) {
        if (err.is(2)) {
            return next(new External(25));
        }
    }
}