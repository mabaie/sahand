'use strict';

module.exports = {
    modified_at: {
        type: Date,
    },
    cname: {
        type: String,
    },
    grade: {
        type: String,
    },
    capacity:{
        type: Number,
    },
    year: {
        type: Date,
    },
    school_id: {
        type: require('mongodb').ObjectId
    }
};