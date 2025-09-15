const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

module.exports.validateTransactionBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    amount: Joi.number().positive().required().messages({
      "number.base": 'The "amount" field must be a number',
      "number.positive": 'The "amount" must be positive',
      "any.required": 'The "amount" field is required',
    }),
    category: Joi.string().required().min(1).messages({
      "string.min": 'The minimum length of the "category" field is 1',
      "string.empty": 'The "category" field must be filled in',
      "any.required": 'The "category" field is required',
    }),
    type: Joi.string().required().valid("income", "expense"),

    dueDate: Joi.date().required().messages({
      "any.required": 'The "Due Date" field is required',
    }),
    dueDateFrequency: Joi.string().required().min(1).messages({
      "string.min": 'The minimum length of the "category" field is 1',
      "string.empty": 'The "category" field must be filled in',
      "any.required": 'The "category" field is required',
    }),
  }),
});

module.exports.validateUserInfoBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'the "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

module.exports.validateUserLogInBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'the "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

module.exports.validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required(),
  }),
});
