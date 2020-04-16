'use strict';

module.exports = {
    modified_at: {
        required: true,
    },
    last_login: {
        required: true,
    },
    userName: {
        required: true,
        unique: true,
    },
    pass: {
        required: true,
    },
    fname: {
        required: true,
    },
    lname: {
        required: true,
    },
    canLogin: {
        required: true,
    },
    isActive: {
        required: true,
    },
    firstLogin: {
        required: true,
    },
    type: {
        required: true,
    },
};