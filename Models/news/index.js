'use strict';

const createModel = require('../createModel');

function News(data) {
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

function NewsModel() {

}
function createNewsModel(name, connection, Schema, Validator) {
    createModel.call(NewsModel, News, name, connection, Schema, Validator); 
    Object.setPrototypeOf(News.prototype,NewsModel);
    News.prototype.constructor = News;

}

module.exports = {
    createNewsModel: createNewsModel,
    NewsModel: NewsModel, 
    News: News
};