'use strict';

module.exports = {
    modified_at: {
        type: Date,
    },
    _id: {
        type: require('mongodb').ObjectID
    },
    parentOne: {
        type: require('mongodb').ObjectID,
    },
    parentTwo: {
        type: require('mongodb').ObjectID
    }
};