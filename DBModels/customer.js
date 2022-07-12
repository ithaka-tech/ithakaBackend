const Joi = require('joi');
const mongoose = require('mongoose');

//defining document schema for cutomers collection
const CustomerSchema = mongoose.model('Customer', mongoose.Schema({
    clientId: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true},
    address: {type: String, required: true}, 
    phoneNumber: {type: String, required: true},
    paymentMode: {type: String, required: true, enum: ['Cash on Delivery', 'Bank Transfer']},  
}));


function validateCustomerParams(paramArgObj){
    const customerSchema = Joi.object({
        sessionID: Joi.string().length(24).alphanum().required(),
        clientID: Joi.string().length(24).alphanum(),
        customerID: Joi.string().length(24).alphanum()
    });

    return customerSchema.validate(paramArgObj);
}

function validateCustomerPostBody(customer){
    const customerSchema = Joi.object({
        clientId: Joi.string().length(24).alphanum(),
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        address: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        paymentMode: Joi.string().valid('Bank Transfer', 'Cash on Delivery').required(),
    });

    return customerSchema.validate(customer);
}

module.exports.CustomerSchema = CustomerSchema;
module.exports.validateCustomerParams = validateCustomerParams;
module.exports.validateCustomerPostBody = validateCustomerPostBody;