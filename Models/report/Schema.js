'use strict';

module.exports = {
    modified_at: {
        type: Date,
    },
    posted_at: {
        type: Date,
    },
    _id: {
        type: require('mongodb').ObjectId
    },
    title:{
        type: String,
    },
    description:{
        type: Object
    },
    attachment:{
        type: String
    },
    school_id: {
        type: require('mongodb').ObjectId
    },
    owner:{
        type: String,
    },
    course_id: {
        type: require('mongodb').ObjectID,
    },
};