'use strict';

module.exports = {
    assignment: {
        type: Array,
    },
    description: {
        type: String,
    },
    deadline: {
        type: Date,
    },
    courseID: {
        type: require('mongodb').ObjectID,
    },
    title: {
        type:String
    },
    date: {
        type: Date
    }
};