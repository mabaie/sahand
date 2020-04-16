'use strict';

const createModel = require('../createModel');

function Score(data) {
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

function ScoreModel() {

}
function createScoreModel(name, connection, Schema, Validator) {
    createModel.call(ScoreModel, Score, name, connection, Schema, Validator); 
    Object.setPrototypeOf(Score.prototype,ScoreModel);
    Score.prototype.constructor = Score;

}

module.exports = {
    createScoreModel: createScoreModel,
    ScoreModel: ScoreModel, 
    Score: Score
};