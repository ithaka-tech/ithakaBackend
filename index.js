require('dotenv').config()

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./Documentation/swagger.json');
const customersAPI = require('./Routes/customers');
const clientsAPI = require('./Routes/clients');
const loginAPI = require('./Routes/logins');
const sessionAPI = require('./Routes/sessions');
//const emailsAPI = require('./Routes/emails');

const app = express();

//notifies that a valid connection to the database has been established
mongoose.connect('mongodb://localhost/ithaka')
    .then(() => console.log('connected to ithaka db'))
    .catch(err => console.error('could not connect to ithaka db'));

//request response pipeline
app.use(cors({origin: 'http://localhost:3000'})); //ONLY FOR TESTING LOCALLY
app.use(express.json());
app.use(helmet());
app.use('/api/customers', customersAPI);
app.use('/api/clients', clientsAPI);
app.use('/api/logins', loginAPI);
app.use('/api/sessions', sessionAPI);
//app.use('/api/emails', emailsAPI);


//endpoint for documentation
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

//this is where we start listening for shtuff to happen
const port = process.env.PORT;
app.listen(port, () => console.log(`Listening on port ${port}`));