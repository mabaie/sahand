'use strict';

module.exports = {
    url: {
        type: String,
    },
    tag:{
        type: String,
    },
    caption:{
        type: String,
    },
    owner: {
        type: String,
    },
    school_id:{
        type: require('mongodb').ObjectID,
    },
    course_id: {
        type: require('mongodb').ObjectID,
    },
    teacher_id: {
        type: require('mongodb').ObjectID,
    },
    posted_at: {
        type:Date,
    },
    modified_at: {
        type: Date,
    },
    newimg:{
        type: Boolean,
    },
    accepted:{
        type: Boolean,
    }
};