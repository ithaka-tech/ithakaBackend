require('dotenv').config()

const mongoose = require('mongoose');
const Joi = require('joi');
const jws = require('jws')

const SessionSchema = mongoose.model('Sessions', mongoose.Schema({ }))

function validateSessionBody(session){
    const pattern = /^[A-Za-z0-9]+.[A-Za-z0-9]+.[A-Za-z0-9]+$/

    const schema = Joi.object({
        sessionID: Joi.string().regex(pattern).required()
    })
    
    return schema.validate(session);
}

async function createNewSession(clientId, clientName, clientEmail){
    // const newSession = new SessionSchema({ });
    // await newSession.save();
    // return String(newSession.id);

    const jsonWebToken = await jws.sign({
        header: {
            alg: 'HS256'
        },
        payload: {
            _id: clientId,
            name: clientName,
            email: clientEmail
        },
        secret: process.env.JWT_SECRET
    })

    return jsonWebToken
}


async function validateSessionID(sessionID){
    const exists = await SessionSchema.findById(sessionID).exec();
    if (exists) return true; 
    return false;
}

module.exports.SessionSchema = SessionSchema;
module.exports.validateSessionBody = validateSessionBody;
module.exports.validateSessionID = validateSessionID;
module.exports.createNewSession = createNewSession;