//this is the module used to keep track of valid email links to customers
//it is also used to send the email to the specified customer based on an email parameter
require('dotenv').config()

const express = require('express');
const router = express.Router();
const aws = require('aws-sdk')


router.get('/signup', async (req, res) => {
    
})


module.exports = router