'use strict';

const createModel = require('../createModel');

function Encourage(data) {
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

function EncourageModel() {

}
function createEncourageModel(name, connection, Schema, Validator) {
    createModel.call(EncourageModel, Encourage, name, connection, Schema, Validator); 
    Object.setPrototypeOf(Encourage.prototype,EncourageModel);
    Encourage.prototype.constructor = Encourage;

}


module.exports = {
    createEncourageModel: createEncourageModel,
    EncourageModel: EncourageModel, 
    Encourage: Encourage
};