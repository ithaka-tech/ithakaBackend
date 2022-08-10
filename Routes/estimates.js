require('dotenv').config()
const express = require('express');
const jws = require('jws');
const { EstimateSchema, validateEstimatePostBody, validateEstimateParams, validateEstimatePutBody } = require('../DBModels/estimate');

const router = express.Router();

//gets all estimates
router.get('/:sessionID', async (req, res) => {
    //check if sessionID and clientID arguments are valid
    const { error } = validateEstimateParams({
        sessionID: req.params.sessionID
    });
    if (error) return res.status(400).send(error.details[0].message);

    //checks if the session ID is active
    const activeSession = jws.verify(req.params.sessionID, 'HS256', process.env.JWT_SECRET);
    if(!activeSession) return res.status(401).send('Unauthorized Request');

    //asynchronously gather all the customers and send
    const estimate = await EstimateSchema.find({
        clientId : JSON.parse(jws.decode(req.params.sessionID).payload)._id
    }).exec();

    return res.send({
        estimates: estimate
    });
})

//gets all estimates for a specific customer
router.get('/:sessionID/:customerID', async (req, res) => {
    //check if sessionID and clientID arguments are valid
    const { error } = validateEstimateParams({
        sessionID: req.params.sessionID,
        customerID: req.params.customerID
    });
    if (error) return res.status(400).send(error.details[0].message);

    //checks if the session ID is active
    const activeSession = jws.verify(req.params.sessionID, 'HS256', process.env.JWT_SECRET);
    if(!activeSession) return res.status(401).send('Unauthorized Request');

    //asynchronously gather all the customers and send
    const estimates = await EstimateSchema.findOne({
        clientId: JSON.parse(jws.decode(req.params.sessionID).payload)._id,
        customerId: req.params.customerID
    }).exec();

    return res.send({
        estimate: estimates
    });
})

//gets all estimates for a specific customer
router.get('/:sessionID/:estimateID', async (req, res) => {
    //check if sessionID and clientID arguments are valid
    const { error } = validateEstimateParams({
        sessionID: req.params.sessionID,
        estimateID: req.params.estimateID
    });
    if (error) return res.status(400).send(error.details[0].message);

    //checks if the session ID is active
    const activeSession = jws.verify(req.params.sessionID, 'HS256', process.env.JWT_SECRET);
    if(!activeSession) return res.status(401).send('Unauthorized Request');

    //asynchronously gather all the customers and send
    const estimates = await EstimateSchema.findOne({
        clientId: JSON.parse(jws.decode(req.params.sessionID).payload)._id,
        _id: req.params.estimateID
    }).exec();

    return res.send({
        estimate: estimates
    });
})

//adding an estimate
router.post('/:sessionID', async (req, res) => {
    //checks if the parameters of the request is correct
    const parErr = validateEstimateParams({ sessionID: req.params.sessionID });
    if(parErr.error) return res.status(400).send(parErr.error.details[0].message);

    //checks if the body of the request is correct
    const bodErr = validateEstimatePostBody(req.body);
    if(bodErr.error) return res.status(400).send(bodErr.error.details[0].message);

    //checks if the session ID is active
    const activeSession = jws.verify(req.params.sessionID, 'HS256', process.env.JWT_SECRET);
    if(!activeSession) return res.status(401).send('Unauthorized Request');

    //creating the new entry
    const newEntry = new EstimateSchema({
        clientId: JSON.parse(jws.decode(req.params.sessionID).payload)._id,
        customerId: req.body.customerId,
        name: req.body.name,
        divisionId: req.body.divisionId,
        estimateType: req.body.estimateType,
        scheduleId: req.body.scheduleId,
        phase: req.body.phase,
    });

    await newEntry.save();

    return res.send({
        estimate: newEntry
    });
})

//updating an estimate
router.put('/:sessionID/:estimateID', async (req, res) => {
    //checks if the parameters of the request is correct
    const parErr = validateEstimateParams({
        sessionID: req.params.sessionID,
        customerID: req.params.estimateID
    });
    if(parErr.error) return res.status(400).send(parErr.error.details[0].message);

    //checks if the body of the request is correct
    const bodErr = validateEstimatePutBody(req.body);
    if(bodErr.error) return res.status(400).send(bodErr.error.details[0].message);
    
    //checks if the session ID is active
    const activeSession = jws.verify(req.params.sessionID, 'HS256', process.env.JWT_SECRET);
    if(!activeSession) return res.status(401).send('Unauthorized Request');

    //find the appropriate customer
    const estimates = await EstimateSchema.findOne({
        clientId: JSON.parse(jws.decode(req.params.sessionID).payload)._id,
        _id: req.params.estimateID
    });

    if(estimates) {
        estimates.customerId = req.body.customerId;
        estimates.name = req.body.name;
        estimates.divisionId = req.body.divisionId;
        estimates.estimateType = req.body.estimateType;
        estimates.scheduleId = req.body.scheduleId;
        estimates.phase = req.body.phase;
    }

    await estimates.save();

    return res.send({
        estimate: estimates
    });
})

//deleting an estimate
router.delete('/:sessionID/:estimateID', async (req, res) => {
    //checks if the parameters of the request is correct
    const parErr = validateEstimateParams({
        sessionID: req.params.sessionID,
        estimateID: req.params.estimateID
    });
    if(parErr.error) return res.status(400).send(parErr.error.details[0].message);
    
    //checks if the session ID is active
    const activeSession = jws.verify(req.params.sessionID, 'HS256', process.env.JWT_SECRET);
    if(!activeSession) return res.status(401).send('Unauthorized Request');
    
    const exists = await EstimateSchema.findById(req.params.estimateID).exec();
    if(!exists) return res.status(400).send('Bad Request')

    const deleted = await EstimateSchema.deleteOne({
        _id: req.params.estimateID,
        clientId: JSON.parse(jws.decode(req.params.sessionID).payload)._id
    }).exec();

    return res.send({
        estimate: deleted,
    }); 
})

module.exports = router;