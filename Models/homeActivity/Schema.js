'use strict';

module.exports = {
    title: {
        type: String,
    },
    school_id: {
        type: require('mongodb').ObjectID
    },
    type: {
        type: String,
    },
    report: {
        type: Array,
    }
};