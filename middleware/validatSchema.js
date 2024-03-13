const Joi = require('joi');

// Define schema using Joi
const schema = Joi.object({
    firstName: Joi.string().pattern(/[a-zA-Z]*/).required(),
    middleName: Joi.string().pattern(/[a-zA-Z\\s]*/),
    lastName: Joi.string().pattern(/[a-zA-Z]*/).required(),
    mobileNumber: Joi.string().required(),
    emailID: Joi.string().email().required(),
    sourceCode: Joi.string().pattern(/[a-zA-Z0-9]*/).required(),
    lgAgentID: Joi.string().pattern(/[a-zA-Z0-9]*/),
    cardType: Joi.string().pattern(/[a-zA-Z0-9]*/).required(),
    lgUID: Joi.string().pattern(/[a-zA-Z0-9]*/).required(),
    breCode: Joi.string().pattern(/[0-9]*/),
    channelCode: Joi.string().pattern(/[a-zA-Z]*/).required(),
    leadSource: Joi.string().pattern(/[a-zA-Z0-9]*/).required(),
    action: Joi.string().required(),
    type:Joi.string().required()
});

module.exports = {schema}

