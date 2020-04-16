'use strict';

module.exports = {
    title: {
        type: String,
    },
    school_id: {
        type: require('mongodb').ObjectID
    },
    encourages: {
        type: Array
    }
};