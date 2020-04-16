'use strict';

module.exports = {
    modified_at: {
        type: Date,
    },
    contact1_id: {
        type: require('mongodb').ObjectID
    },
    contact2_id: {
        type: require('mongodb').ObjectID
    },
    messages: {
        type: Array
    },
};