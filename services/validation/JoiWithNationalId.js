'use strict';
const Joi = require('joi');

const nationalIdJoi = Joi.extend((joi) => ({
    base: joi.string(),
    name: 'string',
    rules: [{
        name: 'isNationalId',
        validate(params, value, state, options) {
            const check = parseInt(value[9]);
            let sum = 0;
            for (let i = 0; i < 9; ++i) {
                sum += parseInt(value[i]) * (10 - i);
            }
            sum %= 11;

            if ((sum < 2 && check == sum) || (sum >= 2 && check + sum == 11)) {
                return value;
            } else {
                return this.createError('string.isNationalId', {
                    v: value
                }, state, options);
            }
        }
    }]
}));
module.exports = nationalIdJoi;