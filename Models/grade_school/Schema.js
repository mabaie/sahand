'use strict';

module.exports = {
    name: {
        type: String,
    },
    mark_type: {
        type: String,
    },
    school_id: {
        type: require('mongodb').ObjectID,
    },
    year:{
        type: Date,
    }
};