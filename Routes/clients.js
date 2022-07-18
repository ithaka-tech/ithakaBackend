require('dotenv').config()

const express = require('express');
const { ClientSchema, validateNewClientBody } = require('../DBModels/client');
const crypto = require('node:crypto');

const router = express.Router();
//post for creation of new client i.e bussiness
//JSON body of request is defined in validateNewClientBody() in ../DBModels/client.js
/**
 * body:
 * {
 *  client_name: 
 *  client_email:
 *  client_password:
 * }
 * 
 * response:
 * {
 *  client: {
    *  client_name: 
    *  client_email:
    *  client_password:
 *  }
 * }
 */
router.post('/', async (req, res) => {
    //validate schema
    const  { error } = validateNewClientBody(req.body);
    if(error) return res.status(400).send(error.details[0].message);
      
    //check if client already exists 
    const exists = await ClientSchema.find({
        email: req.body.email
    }).exec();

    if(exists.length > 0) return res.status(400).send('client already exists');

    //save the new client if valid and return the info with the unhashed password back
    const newClient = new ClientSchema(req.body);
    newClient.password = String(crypto.createHash('sha256', process.env.SECRET).update(req.body.password).digest('hex'));
    await newClient.save();
    return res.send({ 
        client: req.body       
    });

});

module.exports = router;