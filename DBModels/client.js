const Joi = require('joi');
const mongoose = require('mongoose');

const ClientSchema = mongoose.model('Clients', mongoose.Schema({
    client_name: {type: String, required: true},
    client_email: {type: String, required: true},
    client_password: {type: String, required: true}
}));

function validateLoginBody(login){
    const pattern = /^[A-Za-z0-9]+@[A-Za-z]+(.com)$/

    const loginschema = Joi.object({
        client_email: Joi.string().regex(pattern).required(),
        client_password: Joi.string().required()
    })
    
    return loginschema.validate(login);

}

function validateNewClientBody(login){
    const pattern = /^[A-Za-z0-9]+@[A-Za-z]+(.com)$/

    const clientschema = Joi.object({
        client_name: Joi.string().min(3).max(50).required(),
        client_email: Joi.string().regex(pattern).required(),
        client_password: Joi.string().required()
    })

    return clientschema.validate(login);
}

module.exports.ClientSchema = ClientSchema;
module.exports.validateLoginBody = validateLoginBody;
module.exports.validateNewClientBody = validateNewClientBody;