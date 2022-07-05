const express = require('express');
const { validateSessionID, validateSessionBody, SessionSchema } = require('../DBModels/session')

const router = express.Router();

router.delete('/:sessionID', async (req, res) => {
    //checking if the input is valid size
    const { error } = validateSessionBody({ sessionID: req.params.sessionID })
    if(error) return res.status(400).json(error.details[0].message)

    //checking if the sessionID exists
    const validSes = validateSessionID(req.params.sessionID)
    if(!validSes) return res.status(404).send('Unauthorized Request')

    //deleting the session from the table
    const deletedSess = SessionSchema.deleteOne({ _id: req.params.sessionID });
    return res.send({
        deletedEntry: deletedSess
    })

})

module.exports = router;
