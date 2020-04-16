'use strict';

module.exports = {
    date: {
        type: Date,
    },
    events: {
        type: Array,
    },
    school_id: {
        type: require('mongodb').ObjectID
    },
};