
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const customersAPI = require('./Routes/customers');
const clientsAPI = require('./Routes/clients');
const loginAPI = require('./Routes/logins');
const sessionAPI = require('./Routes/sessions');
//const emailsAPI = require('./Routes/emails');

const app = express();

//for testing purposes only
mongoose.connect('mongodb://localhost/ithaka')
    .then(() => console.log('connected to ithaka db'))
    .catch(err => console.error('could not connect to ithaka db'));

//request response pipeline is this
app.use(express.json());
app.use(helmet());
app.use('/api/customers', customersAPI);
app.use('/api/clients', clientsAPI);
app.use('/api/logins', loginAPI);
app.use('/api/sessions', sessionAPI);
//app.use('/api/emails', emailsAPI);

//this is where we start listening for shtuff to happen
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));