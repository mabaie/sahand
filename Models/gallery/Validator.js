'use strict';

module.exports = {
    url: {
        required: true,
    },
    tag:{
        required: true,
    },
    caption:{
        required: true,
    },
    owner: {
        required: true,
    },
    school_id:{
        required: true,
    },
    course_id: {
        required: false,
    },
    teacher_id: {
        required: false,
    },
    posted_at: {
        required: true,
    },
    modified_at: {
        required: true,
    },
    newimg:{
        required: false,
    },
    accepted:{
        required: false,
    }
};