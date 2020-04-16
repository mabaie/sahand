'use strict';
const Model = require('../Model');
const createModel = require('../createModel');

function Parent(data) {
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

function ParentModel() {

}

function createParentModel(name, connection, Schema, Validator) {
    createModel.call(ParentModel, Parent, name, connection, Schema, Validator);
    Object.setPrototypeOf(Parent.prototype, ParentModel);
    Parent.prototype.constructor = Parent;
    Parent.prototype.addId = function (data) {
        data._id = new require('mongodb').ObjectId(data._id.toString());
        return Model.prototype.addId.call(this, data);
    };
}

module.exports = {
    createParentModel: createParentModel,
    ParentModel: ParentModel,
    Parent: Parent
};