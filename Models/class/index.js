'use strict';

const createModel = require('../createModel');

function Class(data) {
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

function ClassModel() {

}
function createClassModel(name, connection, Schema, Validator) {
    createModel.call(ClassModel, Class, name, connection, Schema, Validator); 
    Object.setPrototypeOf(Class.prototype,ClassModel);
    Class.prototype.constructor = Class;

}

module.exports = {
    createClassModel: createClassModel,
    ClassModel: ClassModel, 
    Class: Class
};