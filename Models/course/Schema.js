'use strict';

module.exports = {
    modified_at: {
        type: Date,
    },
    coname: {
        type: String,
    },
    teacher_id: {
        type: require('mongodb').ObjectId,
    },
    class_id: {
        type: require('mongodb').ObjectId
    }
};