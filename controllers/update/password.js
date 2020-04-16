'use strict';
const UserModel = require('../../Models/user').UserModel;
const ExternalError = require('../../Models/Error/External');
const bcrypt = require('bcrypt');

module.exports = async function (req, res, next) {
    try {
        const newPass = req.body.valid.value.NewPass;
        const newHashedPassword = await bcrypt.hash(newPass, 10);
        const oldPass = req.body.valid.value.OldPass;
        const user = await UserModel.findOne({
            _id: req.data._id
        });
        const matched = await bcrypt.compare(oldPass, user[0].pass);
        if (matched) {
            await UserModel.findOneAndUpdate({
                _id: req.data._id,
            }, {
                $set: {
                    pass: newHashedPassword,
                    firstLogin: false
                },
                $currentDate: {
                    modified_at: true,
                }
            }, {
                upsert: false
            })
            return next(new ExternalError(40))
        } else {
            return next(new ExternalError(39))
        }
    } catch (err) {
        if (err.is(2)) {
            return next(new ExternalError(18))
        } else {
            throw new Error();
        }
    }
}