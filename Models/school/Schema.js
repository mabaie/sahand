'use strict';

module.exports = {
    modified_at: {
        type: Date,
    },
    sname: {
        type: String,
    },
    _id: {
        type: require('mongodb').ObjectId
    },
    stype:{
        type: String,
    },
};