"use strict";
const Joi = require("joi");

module.exports = Joi.object().keys({
    Attachment: Joi.object().required(),
});
