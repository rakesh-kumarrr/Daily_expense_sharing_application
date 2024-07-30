const Joi = require('joi');

const expenseSchema = Joi.object({
  description: Joi.string().required(),
  amount: Joi.number().positive().required(),
  paidBy: Joi.string().email().required(), // Updated to email
  splitType: Joi.string().valid('equal', 'exact', 'percentage').required(), // Added split type
  participants: Joi.array().items(Joi.object({
    email: Joi.string().email().required(), // Updated to email
    amount: Joi.number().positive().when('splitType', {
      is: 'exact',
      then: Joi.required(),
      otherwise: Joi.forbidden() // Amount is only required for 'exact' split type
    }),
    percentage: Joi.number().min(0).max(100).when('splitType', {
      is: 'percentage',
      then: Joi.required(),
      otherwise: Joi.forbidden() // Percentage is only required for 'percentage' split type
    })
  })).required()
});

module.exports = { expenseSchema };
