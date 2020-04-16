const Joi = require('joi');

module.exports = Joi.object({
    gid: Joi.number().min(0).max(0).required(),
    id: Joi.number().min(0).max(99).required(),
    message: Joi.string().required(),
    status: Joi.number(),
});
