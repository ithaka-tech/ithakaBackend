require('dotenv').config()
const express = require('express');

const router = express.Router();

//gets all subscription types
router.get('/:sessionID', (req, res) => {

})

//adding a new type of subscription
router.post('/:sessionID', (req, res) => {

})

//updating a user created subscription type
router.put('/:sessionID/:subscriptionID', (req, res) => {
    
})

//deleting a user created subscription type
router.delete('/:sessionID/:subscriptionID', (req, res) => {
    
})

module.exports = router;