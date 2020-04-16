'use strict';

module.exports = {
    modified_at: {
        type: Date,
    },
    last_login: {
        type: Date,
    },
    userName: {
        type: String,
    },
    pass: {
        type: String,
    },
    fname: {
        type: String,
    },
    lname: {
        type: String,
    },
    canLogin: {
        type: Boolean,
    },
    isActive: {
        type: Boolean,
    },
    firstLogin:{
        type: Boolean,
    },
    school_id: {
        type: require('mongodb').ObjectID
    },
    type: {
        type: Object,
    },

};