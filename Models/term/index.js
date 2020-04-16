'use strict';

const createModel = require('../createModel');

function Term(data) {
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

function TermModel() {

}
function createTermModel(name, connection, Schema, Validator) {
    createModel.call(TermModel, Term, name, connection, Schema, Validator); 
    Object.setPrototypeOf(Term.prototype,TermModel);
    Term.prototype.constructor = Term;

}

module.exports = {
    createTermModel: createTermModel,
    TermModel: TermModel, 
    Term: Term
};