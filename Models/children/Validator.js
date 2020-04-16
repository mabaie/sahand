'use strict';

module.exports = {
    modified_at: {
        type: Date,
    },
    _id: {
        required: true,
        unique: true,
    },
    parentOne: {
        required: true,
    },
    parentTwo: {
        required: false,
    }
};