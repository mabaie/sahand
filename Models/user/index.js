'use strict';

const createModel = require('../createModel');

function User(data) {
    //private properties
    let _data;
    this.setData =function(data) {
        _data = data;
    };
    this.getData = function () {
        return _data;
    };
    this.setData(this.addId(data));
}

function UserModel() {

}
function createUserModel(name, connection, Schema, Validator) {
    createModel.call(UserModel, User, name, connection, Schema, Validator); 
    Object.setPrototypeOf(User.prototype,UserModel);
    User.prototype.constructor = User;

}

module.exports = {
    createUserModel: createUserModel,
    UserModel: UserModel, 
    User: User
};