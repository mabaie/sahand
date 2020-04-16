'use strict';

module.exports = {
    _id: {
        required: true,
        unique: true,
    },
    faname: {
        required: true,
    },
    birthday: {
        required: true,
    },
    job: {
        required: false,
    },
    mobile: {
        required: true,
    },
    email: {
        required: true,
    },
    address: {
        required: false,
    },
    grade: {
        required: false,
    },
    modified_at: {
        required: true,
    },
    image: {
        required: false,
    }
};