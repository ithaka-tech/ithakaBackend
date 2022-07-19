require('dotenv').config()
const express = require('express');
const { CustomerSchema, validateCustomerParams, validateCustomerPostBody, validateCustomerPutBody } = require('../DBModels/customer');
const jws = require('jws');

const router = express.Router();

//gets list of all customers
router.get('/:sessionID', async(req, res) => {
    //check if sessionID and clientID arguments are valid
    const { error } = validateCustomerParams({
        sessionID: req.params.sessionID
    });
    if (error) return res.status(400).send(error.details[0].message);

    //checks if the session ID is active
    const activeSession = jws.verify(req.params.sessionID, 'HS256', process.env.JWT_SECRET);
    if(!activeSession) return res.status(401).send('Unauthorized Request');

    //asynchronously gather all the customers and send
    const customers = await CustomerSchema.find({
        clientId : JSON.parse(jws.decode(req.params.sessionID).payload)._id
    }).exec();

    return res.send({
        customers: customers
    });
});

//gets a single customer by customer ID 
router.get('/:sessionID/:customerID', async (req, res) => {
    //check if sessionID and clientID arguments are valid
    const { error } = validateCustomerParams({
        sessionID: req.params.sessionID,
        clientID: req.params.clientID,
        customerID: req.params.customerID
    });
    if (error) return res.status(400).send(error.details[0].message);

    //checks if the session ID is active
    const activeSession = jws.verify(req.params.sessionID, 'HS256', process.env.JWT_SECRET);
    if(!activeSession) return res.status(401).send('Unauthorized Request');

    //asynchronously gather all the customers and send
    const customers = await CustomerSchema.findOne({
        clientID: JSON.parse(jws.decode(req.params.sessionID).payload)._id,
        customerID: req.params.customerID
    }).exec();

    return res.send({
        customer: customers
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
    const activeSession = jws.verify(req.params.sessionID, 'HS256', process.env.JWT_SECRET);
    if(!activeSession) return res.status(401).send('Unauthorized Request');

    //creating the new entry
    const newEntry = new CustomerSchema({
        clientId: JSON.parse(jws.decode(req.params.sessionID).payload)._id,
        email: req.body.email,
        name: req.body.name,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        paymentMode: req.body.paymentMode
    });
    await newEntry.save();
    return res.send({
        customer: newEntry
    });
});

//updates a new customer
router.put('/:sessionID/:customerID', async (req, res) => {
    //checks if the parameters of the request is correct
    const parErr = validateCustomerParams({
        sessionID: req.params.sessionID,
        customerID: req.params.customerID
    });
    if(parErr.error) return res.status(400).send(parErr.error.details[0].message);

    //checks if the body of the request is correct
    const bodErr = validateCustomerPutBody(req.body);
    if(bodErr.error) return res.status(400).send(bodErr.error.details[0].message);
    
    //checks if the session ID is active
    const activeSession = jws.verify(req.params.sessionID, 'HS256', process.env.JWT_SECRET);
    if(!activeSession) return res.status(401).send('Unauthorized Request');

    //find the appropriate customer
    const customers = await CustomerSchema.findOne({
        clientId: JSON.parse(jws.decode(req.params.sessionID).payload)._id,
        _id: req.params.customerID
    });

    if(customer) {
        customers.email = req.body.email;
        customers.name = req.body.name; 
        customers.address = req.body.address;
        customers.phoneNumber = req.body.phoneNumber;
        customers.paymentMode = req.body.paymentMode;
    }

    await customers.save();

    return res.send({
        customer: customers
    });
});

//deletes an existing customer
router.delete('/:sessionID/:customerID', async (req, res) => {
    //checks if the parameters of the request is correct
    const parErr = validateCustomerParams({
        sessionID: req.params.sessionID,
        customerID: req.params.customerID
    });
    if(parErr.error) return res.status(400).send(parErr.error.details[0].message);
    
    //checks if the session ID is active
    const activeSession = jws.verify(req.params.sessionID, 'HS256', process.env.JWT_SECRET);
    if(!activeSession) return res.status(401).send('Unauthorized Request');
    
    const exists = await CustomerSchema.findById(req.params.customerID).exec();
    if(!exists) return res.status(400).send('Bad Request')

    const deleted = await CustomerSchema.deleteOne({
        _id: req.params.customerID,
        clientId: JSON.parse(jws.decode(req.params.sessionID).payload)._id
    }).exec();

    return res.send({
        customer: deleted,
    });  
});

module.exports = router;