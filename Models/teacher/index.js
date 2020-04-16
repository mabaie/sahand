'use strict';
const Model = require('../Model');
const createModel = require('../createModel');

function Teacher(data) {
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

function TeacherModel() {

}

function createTeacherModel(name, connection, Schema, Validator) {
    createModel.call(TeacherModel, Teacher, name, connection, Schema, Validator);
    Object.setPrototypeOf(Teacher.prototype, TeacherModel);
    Teacher.prototype.constructor = Teacher;
    Teacher.prototype.addId = function (data) {
        data._id = new require('mongodb').ObjectId(data._id.toString());
        return Model.prototype.addId.call(this, data);
    };
}

module.exports = {
    createTeacherModel: createTeacherModel,
    TeacherModel: TeacherModel,
    Teacher: Teacher
};