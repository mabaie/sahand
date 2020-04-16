'use strict';
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = require('../../configs').JWT_SECRET_KEY;
const UserModel = require('../../Models/user').UserModel;
const ObjectId = require('mongodb').ObjectId;

async function teacherAuthorization(token){
  const decoded = jwt.verify(token, JWT_SECRET_KEY);
  const user = await UserModel.findOne({_id: new ObjectId(decoded.id)}).catch(()=>{return null;});
  if(user[0].type['teacher']===true) {
    return user[0];
  }
}
module.exports = teacherAuthorization;
