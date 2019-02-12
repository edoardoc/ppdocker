"use strict";

const PAGE_ACCESS_TOKEN = "VALORE_DA_ENV";

const request = require('request');

// Imports dependencies and set up http server
const express = require("express"),
  bodyParser = require("body-parser"),
  app = express().use(bodyParser.json()); // creates express http server

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log("webhook is listening"));

// Creates the endpoint for our webhook
app.post("/webhook", (req, res) => {
  // Parse the request body from the POST
  let body = req.body;
  console.log('body = ' + body);
 

  // Check the webhook event is from a Page subscription
  if (body.object === "page") {


    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
    
      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);
    
      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message, body);        
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });

    // Return a '200 OK' response to all events
    res.status(200).send("EVENT_RECEIVED");
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});

// Adds support for GET requests to our webhook
app.get("/webhook", (req, res) => {
  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "PP34uijkHJGEddyPP3nmkksss232323ebd2aa051";

  // Parse the query params
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

/*
three functions that will handle the incoming webhook event types we 
want to support, as well as responding via the send API.
*/

// Handles messages events
function handleMessage(sender_psid, received_message, thebody) {
  let response;
  getUserinfo(sender_psid)
  
  // Checks if the message contains text
  if (received_message.text) {    
    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    response = {
      "text": `Benvenuto "${thebody.firstName}" hai inviato questo messaggio: "${received_message.text}". Now send me an attachment!`
    }
  } else if (received_message.attachments) {
    // Get the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "questa e' l'immagine giusta?",
            "subtitle": "Premi un pulsante per rispondere.",
            "image_url": attachment_url,
            "buttons": [
              {
                "type": "postback",
                "title": "Si!",
                "payload": "Si",
              },
              {
                "type": "postback",
                "title": "No!",
                "payload": "no",
              }
            ],
          }]
        }
      }
    }
  } 
  
  // Send the response message
  callSendAPI(sender_psid, response);    
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
  let response;
  
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'si') {
    response = { "text": "Grazie!" }
  } else if (payload === 'no') {
    response = { "text": "Oups, prova ad inviare un'altra immagine..." }
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}


function getUserinfo(sender_psid) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/" + sender_psid,
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "GET",
    "json": "true",
    "time": "true"
  }, (err, res, body) => {
    if (!err) {
      console.log('user received, ')
      console.log(res.firstName)
      console.log(res.toJSON)      
    } else {
      console.error("Unable to get user info: " + err);
    }
  }); 
}
// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
}