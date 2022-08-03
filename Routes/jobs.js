require('dotenv').config()
const express = require('express');

const router = express.Router();

//gets all jobs that pertain to a certain division
router.get('/:sessionID/:divisionID', (req, res) => {

})

//adding a job for a specific division
router.post('/:sessionID/:divisionID', (req, res) => {

})

//updating an job
router.put('/:sessionID/:jobID', (req, res) => {
    
})

//deleting a job
router.delete('/:sessionID/:jobID', (req, res) => {

})

module.exports = router;