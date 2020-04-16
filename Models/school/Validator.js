'use strict';
module.exports = {
    modified_at: {
        required: true,
    },
    sname: {
        required: true,
    },
    _id: {
        required: true,
        unique: true,
    },
    stype:{
        required: true,
    }
};