'use strict';
const UserModel = require('../Models/user').UserModel;
const ObjectID = require('mongodb').ObjectID;

module.exports = async function(req,res,next){
    let user = await UserModel.findOne({_id: new ObjectID(req.params.id)});
    user = user[0];
    req.data._id = user.school_id;
    next();
}