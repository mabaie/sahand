'use strict';

const Model = require('./Model');

function createModel(dataModelClass, name, connection, Schema, Validator) {
    Object.setPrototypeOf(this, Model.prototype);
    Model.call(this, name, connection, Schema, Validator);
    this.prototype.constructor = this;
    dataModelClass.prototype.toObject = function () {
        return this.transform();
    };

    dataModelClass.prototype.save = async function () {
        // this.validate();
        const obj = this.toObject();
        await Model.prototype.save.call(this, obj);
    };

    dataModelClass.prototype.transform = function() {
        return this.getData();
    };
    dataModelClass.prototype.addId = function(data) {
        return Model.prototype.addId.call(this, data);
    };
    dataModelClass.prototype.getId = function() {
        return this.getData()._id;
    };
}

module.exports = createModel;