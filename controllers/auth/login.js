'use strict';
const UserModel = require('../../Models/user').UserModel;
const ExternalError = require('../../Models/Error/External');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../configs');

async function loginController(req, res, next) {
    const body = req.body.valid.value;
    UserModel.findOneAndUpdate({
        userName: body.userName,
    }, {$set: {last_login: new Date()}}).then(async (user) => {
        //check login permision
        if(!(user.canLogin)) {
            return next(new ExternalError(27))
        }
        //check password
        const matched = await bcrypt.compare(body.Password, user.pass);
        if (matched) {
            //create token and send
            const access_token = jwt.sign({
                id: user._id
            }, config.JWT_SECRET_KEY, {
                expiresIn: '30d'
            });
            res.set('Authorization', 'Bearer ' + access_token)
                .json({
                    FirstName: user.fname,
                    LastName: user.lname,
                    Type: user.type,
                    FirstLogin: user.firstLogin,
                });
        } else {
            return next(new ExternalError(18));
        }
    }).catch(async (err) => {
        
        if (err.is(2)) {
            return next(new ExternalError(18));
        } else {
            throw err;
        }
    });
}

module.exports = loginController;