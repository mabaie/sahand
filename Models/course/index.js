'use strict';

const createModel = require('../createModel');

function Course(data) {
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

function CourseModel() {

}
function createCourseModel(name, connection, Schema, Validator) {
    createModel.call(CourseModel, Course, name, connection, Schema, Validator); 
    Object.setPrototypeOf(Course.prototype,CourseModel);
    Course.prototype.constructor = Course;

}

module.exports = {
    createCourseModel: createCourseModel,
    CourseModel: CourseModel, 
    Course: Course
};