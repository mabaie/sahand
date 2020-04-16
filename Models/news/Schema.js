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
    news:{
        type: Object
    },
    school_id: {
        type: require('mongodb').ObjectId
    }
};