const Joi = require('joi');

const userSchema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    password: Joi.string().min(6).required(),
});

const userPartialSchema = Joi.object({
    email: Joi.string().email().optional(),
    name: Joi.string().optional(),
    password: Joi.string().min(6).optional(),
});


exports.userSchema = userSchema
exports.userPartialSchema = userPartialSchema