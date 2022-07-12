require('dotenv').config()

const express = require('express');
const { ClientSchema, validateLoginBody } = require('../DBModels/client');
const _ = require('lodash');
const crypto = require('node:crypto');
const { createNewSession } = require('../DBModels/session');

const router = express.Router();

//authentication function for login
router.post('/', async (req, res) => {

    const  { error } = validateLoginBody(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const loginAuth = await ClientSchema.find({ 
        email: req.body.email, 
        password: await String(crypto.createHash('sha256', process.env.SECRET).update(req.body.password).digest('hex')) 
    }).exec();
    if(loginAuth.length === 0) return res.status(400).send('bad username or password');

    return res.send({
        sessionId: await createNewSession(),
        accountInfo: _.pick(loginAuth[0], ['_id','name', 'email'])
    });
});

module.exports = router;