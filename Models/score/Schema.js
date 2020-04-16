'use strict';

module.exports = {
    score_param_id: {
        type: require('mongodb').ObjectID,
    },
    score_param_sub_id: {
        type: Number,
    },
    student_id: {
        type: require('mongodb').ObjectID,
    },
    course_id: {
        type: require('mongodb').ObjectID,
    },
    term_id: {
        type: require('mongodb').ObjectID,
    },
    grade: {
        type: String,
    },
    manager_accept:{
        type: Boolean,
    },
    parent_visible:{
        type: Boolean,
    },
    last_modify:{
        type: Date,
    }
};