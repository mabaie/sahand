'use strict';

module.exports = {
    _id: {
        type: require('mongodb').ObjectId,
    },
    faname: {
        type: String,
    },
    degree: {
        type: String,
    },
    major: {
        type: String,
    },
    birthday: {
        type: Date,
    },
    job: {
        type: String,
    },
    mobile: {
        type: String,
    },
    email: {
        type: String,
    },
    address: {
        type: String,
    },
    grade: {
        type: String,
    },
    modified_at: {
        type: Date,
    },
    image: {
        type:String,
    }
};