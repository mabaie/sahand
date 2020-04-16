'use strict';

const createModel = require('../createModel');

function Grades(data) {
    //private properties
    let _data;
    this.setData =function(data) {
        _data = data;
    };
    this.getData = function () {
        return _data;
    };
    this.setData(this.addId(data));

    //this.createIndex( { name: 1, school_id: 1}, { unique: true } )
}

function GradesModel() {

}
function createGradesModel(name, connection, Schema, Validator) {
    createModel.call(GradesModel, Grades, name, connection, Schema, Validator); 
    Object.setPrototypeOf(Grades.prototype,GradesModel);
    Grades.prototype.constructor = Grades;

}

module.exports = {
    createGradesModel: createGradesModel,
    GradesModel: GradesModel, 
    Grades: Grades
};