//this is the module used to keep track of valid email links to customers
//it is also used to send the email to the specified customer based on an email parameter
require('dotenv').config()

const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk')


AWS.config.update({region: 'us-east-1'});
const sesv2 = new AWS.SESV2();

//new function
/**
 * the body of the function is as follows:
 * {
 *  email: customers email address
 * }
 */
router.post('/signup', async (req, res) => {
  
  const clientName = 'Randy Brothers Landscaping'
  const body = `<!DOCTYPE html>\
  <html lang=\"en\">\
    <head>\
        <meta charset=\"UTF-8\"/>\
        <title>Onboarding</title>\
    </head>\
    <body>\
      <p>Hi! Thank you for your interest in <ins style=\"text-decoration: none;\">${clientName}</ins>. To ensure that we provide you \
        with the best service possible, please fill out the following fields.\
      </p>\
      <a href=\"${process.env.CUSTOMER_ONBOARDING_DOMAIN}\"> Click to access form </a>\
      <p>In the comments section, please note any special requests or items that we should be aware of when we visit your property. \
        <br/>\
        <br/>\
        Jobs will be invoiced within a few days after they are completed and the invoice will be emailed to the email address provided to allow\
        for a smooth and easy transaction.\
        <br/>\
        <br/>\
        We take pride in the service we provide and always appreciate feedback, google reviews, or simply a smile! We look forward to working with you to make sure your \
        home looks, and feels, like home.\
      </p>\
    </body>\
  </html>`

  //Create sendEmail params 
  var params = {
    Destination: { 
      ToAddresses: [
        'likhithborela@gmail.com',
      ],
    },
    Message: { /* required */ 
      Body: { /* required */
        Html: {
        Charset: "UTF-8",
        Data: body
        },
        Text: {
        Charset: "UTF-8",
        Data: "",
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Landscaping Job Request'
      }
      },
    Source: `${clientName.split(' ').join('')}@ithaka.tech`, /* required */
    Tags: [
      {
        Name: 'STRING', /* required */
        Value: 'STRING' /* required */
      },
      /* more items */
    ]
  };  

  //Create the promise and SES service object
  var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

  //Handle promise's fulfilled/rejected states
  sendPromise.then(
    function(data) {
      res.send(data.MessageId);
    }).catch(
      function(err) {
      console.error(err, err.stack);
    });

})

module.exports = router