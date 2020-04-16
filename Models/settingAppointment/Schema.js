'use strict';

module.exports = {
    teacher_id: {
        type: require('mongodb').ObjectID
    },
    school_id:{
        type: require('mongodb').ObjectID
    },
    month_sets:{
        type: Date,
    },
    appointments: {
        type: Array
    }
};