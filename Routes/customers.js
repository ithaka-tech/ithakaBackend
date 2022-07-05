const express = require('express');
const { CustomerSchema, validateCustomerParams, validateCustomerPostBody } = require('../DBModels/customer');
const { validateSessionID } = require('../DBModels/session');

const router = express.Router();

//gets list of all customers
router.get('/:sessionID/:clientID', async(req, res) => {
    //check if sessionID and clientID arguments are valid
    const { error } = validateCustomerParams({
        sessionID: req.params.sessionID,
        clientID: req.params.clientID
    });
    if (error) return res.status(400).send(error.details[0].message)

    //checks if the session ID is active
    const activeSession = await validateSessionID(req.params.sessionID);
    if(!activeSession) return res.status(401).send('Unauthorized Request');

    //asynchronously gather all the customers and send
    const customers = await CustomerSchema.find({
        clientId : req.params.clientID
    }).exec();

    return res.send({
        customers: customers,
        sessionId: req.params.sessionID
    });
});

//gets a single customer by customer ID 
router.get('/:sessionID/:clientID/:customerID', async (req, res) => {
    //check if sessionID and clientID arguments are valid
    const { error } = validateCustomerParams({
        sessionID: req.params.sessionID,
        clientID: req.params.clientID,
        customerID: req.params.customerID
    });
    if (error) return res.status(400).send(error.details[0].message);

    //checks if the session ID is active
    const activeSession = validateSessionID(req.param.sessionID);
    if(!activeSession) return res.status(401).send('Unauthorized Request');

    //asynchronously gather all the customers and send
    const customers = await CustomerSchema.findOne({
        clientID: req.params.clientID,
        customerID: req.params.customerID
    }).exec();

    return res.send({
        customer: customers,
        sessionId: req.params.sessionID
    });
});

//creates a new customer
router.post('/:sessionID', async (req, res) => {

    //checks if the parameters of the request is correct
    const parErr = validateCustomerParams({ sessionID: req.params.sessionID });
    if(parErr.error) return res.status(400).send(parErr.error.details[0].message);

    //checks if the body of the request is correct
    const bodErr = validateCustomerPostBody(req.body);
    if(bodErr.error) return res.status(400).send(bodErr.error.details[0].message);

    //checks if the session ID is active
    const activeSession = validateSessionID(req.params.sessionID);
    if(!activeSession) return res.status(401).send('Unauthorized Request');

    //creating the new entry
    const newEntry = new CustomerSchema(req.body, );
    await newEntry.save();

    return res.send({
        newEntry: newEntry,
        sessionId: req.params.sessionID
    });
});

//updates a new customer
router.put('/:sessionID/:clientID/:customerID', async (req, res) => {
    //checks if the parameters of the request is correct
    const parErr = validateCustomerParams({
        sessionID: req.params.sessionID,
        clientID: req.params.clientID,
        customerID: req.params.customerID
    });
    if(parErr.error) return res.status(400).send(parErr.error.details[0].message);

    //checks if the body of the request is correct
    const bodErr = validateCustomerPostBody(req.body);
    if(bodErr.error) return res.status(400).send(bodErr.error.details[0].message);
    
    //checks if the session ID is active
    const activeSession = validateSessionID(req.params.sessionID);
    if(!activeSession) return res.status(401).send('Unauthorized Request');

    //find the appropriate customer
    const customers = await CustomerSchema.findOne({
        clientId: req.params.clientID,
        _id: req.params.customerID
    });

    if(customer) {
        //customers.trackingId = req.body.trackingId;
        customers.email = req.body.email;
        customers.name = req.body.name; 
        customers.address = req.body.address;
        customers.phoneNumber = req.body.phoneNumber;
        customers.paymentMode = req.body.paymentMode;
        customers.status = req.body.status;
    }

    await customers.save();

    return res.send({
        updatedEntry: customers,
        session_ID: req.body.session_ID
    });
});

//deletes an existing customer
router.delete('/:sessionID/:clientID/:customerID', async (req, res) => {
    //checks if the parameters of the request is correct
    const parErr = validateCustomerParams({
        sessionID: req.params.sessionID,
        clientID: req.params.clientID,
        customerID: req.params.customerID
    });
    if(parErr.error) return res.status(400).send(parErr.error.details[0].message);
    
    //checks if the session ID is active
    const activeSession = validateSessionID(req.params.sessionID);
    if(!activeSession) return res.status(401).send('Unauthorized Request');
    
    const exists = await CustomerSchema.findById(req.params.customerID).exec();
    if(!exists) return res.status(400).send('Bad Request')

    const deleted = await CustomerSchema.deleteOne({
        _id: req.params.customerID,
        sessionId: req.params.sessionID
    }).exec();

    return res.send({
        deletedEntry: deleted,
        sessionId: req.params.sessionID
    });  
});

module.exports = router;