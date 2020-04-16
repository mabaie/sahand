'use strict';

const createModel = require('../createModel');

function Magazine(data) {
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

function MagazineModel() {

}
function createMagazineModel(name, connection, Schema, Validator) {
    createModel.call(MagazineModel, Magazine, name, connection, Schema, Validator); 
    Object.setPrototypeOf(Magazine.prototype,MagazineModel);
    Magazine.prototype.constructor = Magazine;

}

module.exports = {
    createMagazineModel: createMagazineModel,
    MagazineModel: MagazineModel, 
    Magazine: Magazine
};