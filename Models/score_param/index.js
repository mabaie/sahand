'use strict';

const createModel = require('../createModel');

function ScoreParam(data) {
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

function ScoreParamModel() {

}
function createScoreParamModel(name, connection, Schema, Validator) {
    createModel.call(ScoreParamModel, ScoreParam, name, connection, Schema, Validator); 
    Object.setPrototypeOf(ScoreParam.prototype,ScoreParamModel);
    ScoreParam.prototype.constructor = ScoreParam;

}

module.exports = {
    createScoreParamModel: createScoreParamModel,
    ScoreParamModel: ScoreParamModel, 
    ScoreParam: ScoreParam
};