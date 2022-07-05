const express = require('express');
const { ClientSchema, validateLoginBody } = require('../DBModels/client');
const _ = require('lodash');
const crypto = require('node:crypto');
const { createNewSession } = require('../DBModels/session');

const router = express.Router();
const secret = 'we are ithaka';

//authentication function for login
router.post('/', async (req, res) => {

    const  { error } = validateLoginBody(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const loginAuth = await ClientSchema.find({ 
        client_email: req.body.client_email, 
        client_password: String(crypto.createHash('sha256', secret).update(req.body.client_password).digest('hex')) 
    }).exec();
    if(loginAuth.length === 0) return res.status(400).send('bad username or password');

    return res.send({
        session_ID: await createNewSession(),
        account_info: _.pick(loginAuth[0], ['client_name', 'client_email'])
    });
});

module.exports = router;