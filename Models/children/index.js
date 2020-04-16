'use strict';

const createModel = require('../createModel');

function Children(data) {
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

function ChildrenModel() {

}
function createChildrenModel(name, connection, Schema, Validator) {
    createModel.call(ChildrenModel, Children, name, connection, Schema, Validator); 
    Object.setPrototypeOf(Children.prototype,ChildrenModel);
    Children.prototype.constructor = Children;

}

module.exports = {
    createChildrenModel: createChildrenModel,
    ChildrenModel: ChildrenModel, 
    Children: Children
};