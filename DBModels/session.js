const mongoose = require('mongoose');
const Joi = require('joi');

const SessionSchema = mongoose.model('Sessions', mongoose.Schema({ }))

function validateSessionBody(session){

    const schema = Joi.object({
        sessionID: Joi.string().length(24).alphanum().required()
    })
    
    return schema.validate(session);
}

async function createNewSession(){
    const newSession = new SessionSchema({ });
    await newSession.save();
    return String(newSession.id);
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