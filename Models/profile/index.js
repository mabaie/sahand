'use strict';
const Model = require('../Model');
const createModel = require('../createModel');

function ProfileModel() {

}

function Profile(data) {
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

function createProfileModel(name, connection, Schema, Validator) {
    createModel.call(ProfileModel, Profile, name, connection, Schema, Validator);
    
    Object.setPrototypeOf(Profile.prototype,ProfileModel);
    Profile.prototype.constructor = Profile;
    
    Profile.prototype.addId = function(data) {
        data._id = new require('mongodb').ObjectId(data._id.toString());
        return Model.prototype.addId.call(this, data);
    };
}

module.exports = {
    createProfileModel:createProfileModel, 
    ProfileModel: ProfileModel,
    Profile: Profile
};