'use strict';

module.exports = {
    title: {
        type: String,
    },
    active: {
        type: Boolean,
    },
    school_id: {
        type: require('mongodb').ObjectID,
    },
    last_modify: {
        type: Date,
    },
    create_date: {
        type: Date,
    }
};