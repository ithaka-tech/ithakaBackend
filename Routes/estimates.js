require('dotenv').config()

const express = require('express');

const router = express.Router();

//gets all estimates
router.get('/:sessionID', (req, res) => {

})

//gets all estimates for a specific customer
router.get('/:sessionID/:customerID', (req, res) => {

})

//adding an estimate
router.post('/:sessionID', (req, res) => {

})

//updating an estimate
router.put('/:sessionID', (req, res) => {
    
})