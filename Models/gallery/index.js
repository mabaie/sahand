'use strict';

const createModel = require('../createModel');

function Gallery(data) {
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

function GalleryModel() {

}
function createGalleryModel(name, connection, Schema, Validator) {
    createModel.call(GalleryModel, Gallery, name, connection, Schema, Validator); 
    Object.setPrototypeOf(Gallery.prototype,GalleryModel);
    Gallery.prototype.constructor = Gallery;

}

module.exports = {
    createGalleryModel: createGalleryModel,
    GalleryModel: GalleryModel, 
    Gallery: Gallery
};