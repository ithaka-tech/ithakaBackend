const Joi = require('joi');
const mongoose = require('mongoose');

const ClientSchema = mongoose.model('Clients', mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true}
}));

function validateLoginBody(login){
    const pattern = /^[A-Za-z0-9]+@[A-Za-z]+(.com)$/

    const loginschema = Joi.object({
        email: Joi.string().regex(pattern).required(),
        password: Joi.string().required()
    })
    
    return loginschema.validate(login);

}

function validateNewClientBody(login){
    const pattern = /^[A-Za-z0-9]+@[A-Za-z]+(.com)$/

    const clientschema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().regex(pattern).required(),
        password: Joi.string().min(8).required()
    })

    return clientschema.validate(login);
}

module.exports.ClientSchema = ClientSchema;
module.exports.validateLoginBody = validateLoginBody;
module.exports.validateNewClientBody = validateNewClientBody;