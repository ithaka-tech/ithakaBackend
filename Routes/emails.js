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

// Create sendEmail params 
// var params = {
//   Destination: { 
//     ToAddresses: [
//       'likhithborela@gmail.com',
//     ],
//   },
//   Message: { /* required */
//     Body: { /* required */
//       Html: {
//        Charset: "UTF-8",
//        Data: "Welcome to blah blah lanscaping services, "
//       },
//       Text: {
//        Charset: "UTF-8",
//        Data: "idk",
//       },
//      },
//      Subject: {
//       Charset: 'UTF-8',
//       Data: 'Landscaping Job Request'
//      }
//     },
//   Source: 'mail@ithaka.tech', /* required */
//   Tags: [
//     {
//       Name: 'STRING', /* required */
//       Value: 'STRING' /* required */
//     },
//     /* more items */
//   ]
// };

// // Create the promise and SES service object
// var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

// // Handle promise's fulfilled/rejected states
// sendPromise.then(
//   function(data) {
//     console.log(data.MessageId);
//   }).catch(
//     function(err) {
//     console.error(err, err.stack);
//   });

  var params = {
  };
  sesv2.getAccount(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });

})


module.exports = router