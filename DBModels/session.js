require('dotenv').config()

const Joi = require('joi');
const jws = require('jws')


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

module.exports.validateSessionBody = validateSessionBody;
module.exports.createNewSession = createNewSession;