const Joi = require('joi');
const mongoose = require('mongoose');

//defining document schema for cutomers collection
const EstimateSchema = mongoose.model('Estimates', mongoose.Schema({
    clientId: {type: String, required: true},
    customerId: {type: String, required: true},
    name: {type: String, required: true},
    divisionId: {type: String, required: true},
    estimateType: {type: String, required: true, enum: ['Service', 'Project']},
    scheduleId: {type: String, required: true},
    phase: {type: String, required: true, enum: ['Quote', 'Contract Signed', 'In Progress', 'Completed']},
}));

function validateEstimatePostBody(estimate){
    const estimateSchema = Joi.object({
        clientId: Joi.string().length(24).required(),
        customerId: Joi.string().length(24).required(),
        name: Joi.string().required(),
        divisionId: Joi.string().length(24).required(),
        estimateType: Joi.string().valid('Service', 'Project').required(),
        scheduleId: Joi.string().length(24).required(),
        phase: Joi.string().valid('Quote', 'Contract Signed', 'In Progress', 'Completed').required(),
    });

    return estimateSchema.validate(estimate);
}

function validateEstimatePutBody(estimate){
    const estimateSchema = Joi.object({
        customerId: Joi.string().length(24).required(),
        name: Joi.string().required(),
        divisionId: Joi.string().length(24).required(),
        estimateType: Joi.string().valid('Service', 'Project').required(),
        scheduleId: Joi.string().length(24).required(),
        phase: Joi.string().valid('Quote', 'Contract Signed', 'In Progress', 'Completed').required(),
    });

    return estimateSchema.validate(estimate);
}

function validateEstimateParams(paramArgObj){

    const pattern = /^[A-Za-z0-9-_]+.[A-Za-z0-9-_]+.[A-Za-z0-9-_]+$/

    const customerSchema = Joi.object({
        sessionID: Joi.string().regex(pattern).required(),
        customerID: Joi.string().length(24).alphanum(),
        estimateID: Joi.string().length(24).alphanum(),
    });

    return customerSchema.validate(paramArgObj);
}

module.exports.EstimateSchema = EstimateSchema;
module.exports.validateEstimatePostBody = validateEstimatePostBody;
module.exports.validateEstimatePutBody = validateEstimatePutBody;
module.exports.validateEstimateParams = validateEstimateParams;
