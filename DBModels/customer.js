const Joi = require('joi');
const mongoose = require('mongoose');

//defining document schema for cutomers collection
const CustomerSchema = mongoose.model('Customer', mongoose.Schema({
    //trackingId: {type: String, required: true},
    clientId: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true},
    address: {type: String, required: true}, 
    phoneNumber: {type: String, required: true},
    paymentMode: {type: String, required: true, enum: ['Cash on Delivery', 'Bank Transfer']},
    //status: {type: String, required: true, enum: ['Delivered', 'Processed', 'Cancelled']},
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
        //trackingId: Joi.string().min(5).required(),
        clientId: Joi.string().length(24).alphanum(),
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        address: Joi.string().required(), //probably will modify using regex
        phoneNumber: Joi.string().required(),
        paymentMode: Joi.string().valid('Bank Transfer', 'Cash on Delivery').required(),
        //status: Joi.string().valid('Cancelled', 'Processed', 'Delivered').required(),
    });

    return customerSchema.validate(customer);
}

module.exports.CustomerSchema = CustomerSchema;
module.exports.validateCustomerParams = validateCustomerParams;
module.exports.validateCustomerPostBody = validateCustomerPostBody;