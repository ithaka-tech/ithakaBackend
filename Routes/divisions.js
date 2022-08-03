require('dotenv').config()
const express = require('express');

const router = express.Router();

//gets all divisions
router.get('/:sessionID', (req, res) => {

})

//adding a custom division
router.post('/:sessionID', (req, res) => {

})

//updating a division
router.put('/:sessionID/:divisionID', (req, res) => {
    
})

//deleting a user created job division
router.delete('/:sessionID/:divisionID', (req, res) => {

})

module.exports = router;