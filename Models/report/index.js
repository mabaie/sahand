'use strict';

const createModel = require('../createModel');

function Report(data) {
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

function ReportModel() {

}
function createReportModel(name, connection, Schema, Validator) {
    createModel.call(ReportModel, Report, name, connection, Schema, Validator); 
    Object.setPrototypeOf(Report.prototype,ReportModel);
    Report.prototype.constructor = Report;

}

module.exports = {
    createReportModel: createReportModel,
    ReportModel: ReportModel, 
    Report: Report
};