'use strict';

const createModel = require('../createModel');

function HomeActivity(data) {
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

function HomeActivityModel() {

}
function createHomeActivityModel(name, connection, Schema, Validator) {
    createModel.call(HomeActivityModel, HomeActivity, name, connection, Schema, Validator); 
    Object.setPrototypeOf(HomeActivity.prototype,HomeActivityModel);
    HomeActivity.prototype.constructor = HomeActivity;

}


module.exports = {
    createHomeActivityModel: createHomeActivityModel,
    HomeActivityModel: HomeActivityModel, 
    HomeActivity: HomeActivity
};