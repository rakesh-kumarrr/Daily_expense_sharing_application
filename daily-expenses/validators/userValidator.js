const Joi = require('joi');

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  mobile: Joi.string().pattern(/^[0-9]{10}$/).required()
});

module.exports = { userSchema };
