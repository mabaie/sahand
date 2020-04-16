'use strict';

const createModel = require('../createModel');

function Assignment(data) {
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

function AssignmentModel() {

}
function createAssignmentModel(name, connection, Schema, Validator) {
    createModel.call(AssignmentModel, Assignment, name, connection, Schema, Validator); 
    Object.setPrototypeOf(Assignment.prototype,AssignmentModel);
    Assignment.prototype.constructor = Assignment;

}

module.exports = {
    createAssignmentModel: createAssignmentModel,
    AssignmentModel: AssignmentModel, 
    Assignment: Assignment
};