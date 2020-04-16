'use strict';
const Model = require('../Model');
const createModel = require('../createModel');

function School(data) {
    //private properties
    let _data;
    this.setData = function (data) {
        _data = data;
    };
    this.getData = function () {
        return _data;
    };
    this.setData(this.addId(data));
}

function SchoolModel() {

}

function createSchoolModel(name, connection, Schema, Validator) {
    createModel.call(SchoolModel, School, name, connection, Schema, Validator);
    Object.setPrototypeOf(School.prototype, SchoolModel);
    School.prototype.constructor = School;
    School.prototype.addId = function (data) {
        data._id = new require('mongodb').ObjectId(data._id.toString());
        return Model.prototype.addId.call(this, data);
    };
}

module.exports = {
    createSchoolModel: createSchoolModel,
    SchoolModel: SchoolModel,
    School: School
};