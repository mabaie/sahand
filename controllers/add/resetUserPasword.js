'use strict'
const ObjectID = require('mongodb').ObjectID;
const UserModel = require('../../Models/user').UserModel;
const External = require('../../Models/Error/External');
const generatePass = require('../../services/generatePass');
const InternalError = require('../../Models/Error/Internal');
const bcrypt = require('bcrypt');
const configs = require('../../configs')
const fs = require('fs');
module.exports = async function (req, res, next) {
    try {
        const id=req.body.ID
        let password = generatePass();
        const hashedPass = await bcrypt.hash(password, 10);
        console.log('body is',id,req.body,new ObjectID(id))
        await UserModel.findOneAndUpdate({
            _id: new ObjectID(id),
        }, {
            $set: {pass:hashedPass,firstLogin:true},
            $currentDate: {
                last_modified: true
            },
        }, {
            upsert: false,
        })
        res.json({password:password});
    } catch (err) {
        if (err.is(2)) {
            return next(new External(25));
        }
    }
}