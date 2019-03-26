"use strict";

const PAGE_ACCESS_TOKEN = "VALORE_DA_ENV";

const request = require('request');

// Imports dependencies and set up http server
const express = require("express"),
      bodyParser = require("body-parser"),
      app = express().use(bodyParser.json()); // creates express http server

app.listen(process.env.PORT || 1337, () => console.log("webhook is listening"));  // Sets server port and logs message on success

setGreeting();
setPersistentMenu();

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
        handleMessage(sender_psid, webhook_event.message);        
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

function handleMessage(sender_psid, received_message) {
  let response;

  // get user info as in https://developers.facebook.com/docs/graph-api/reference/user
  request({
    "uri": "https://graph.facebook.com/v2.6/" + sender_psid,
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "GET",
    "json": "true",
    "time": "true"
  }, (err, res, body) => {
    if (!err) {
      console.error("user info: " + body.first_name);

      // Checks if the message contains text
      if (received_message.text) {    
        // Create the payload for a basic text message, which
        // will be added to the body of our request to the Send API
        response = {
          "text": `Benvenuto ${body.first_name} hai inviato questo messaggio: "${received_message.text}". ora prova ad inviare un immagine!`
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
                "title": "e' questa l'immagine che hai inviato?",
                "subtitle": "Premi un pulsante per rispondere.",
                "image_url": attachment_url,
                "buttons": [
                  {
                    "type": "postback",
                    "title": "Si!",
                    "payload": "si",
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
      callSendAPI(sender_psid, response); // Send the response message

    } else {
      console.error("Unable to get user info: " + err);
    }
  });
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
  let response;
  
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'si') {
    response = { "text": "Grazie per la collaborazione :)" }
  } else if (payload === 'no') {
    response = { "text": "Oups :/ , prova ad inviare un'altra immagine..." }
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
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

function setGetStarted() {
	request(
		{
			uri: "https://graph.facebook.com/v2.6/me/messenger_profile",
			qs: { access_token: PAGE_ACCESS_TOKEN },
			method: "POST",
			json: { "get_started": {"payload": "<postback_payload>"} }
		},
		(err, res, body) => {
			if (!err) {
				console.log(`get Started button up`);
			} else {
				console.error("unable to set Started button:" + err);
			}
		}
	);
}

/*

Do consider your greeting an introduction and a summary of your experience. Greetings have a 160 character maximum, so keep it concise.
Do communicate your main functionality. Context helps people understand how to interact with you and sets expectations about your capabilities.
Don’t treat your greeting like an instructional manual. Because your greeting disappears, use your actual messages to introduce specific functionality and commands.
Don't use excessive text formatting (ex: spacing, punctuation, returns) in your greeting so you can make the most of the character limit.


*/
function setGreeting() {
	request(
		{
			uri: "https://graph.facebook.com/v2.6/me/messenger_profile",
			qs: { access_token: PAGE_ACCESS_TOKEN },
			method: "POST",
			json: { 
				"greeting": [
					{
						"locale": "default",
						"text": "(ld) Welcome {{user_first_name}} {{user_last_name}} {{user_full_name}}"
					},
					{
						"locale": "it_IT",
						"text": "Benvenuto {{user_full_name}}!!"
					}
				]
			}
		},
		(err, res, body) => {
			if (!err) {
				console.log(`greeting msg up`);
			} else {
				console.error("unable to set greeting msg:" + err);
			}
		}
	);
}

function setPersistentMenu() {
	request(
		{
			uri: "https://graph.facebook.com/v2.6/me/messenger_profile",
			qs: { access_token: PAGE_ACCESS_TOKEN },
			method: "POST",
			json: {
				"persistent_menu":[
					{
						"locale":"default",
						//"composer_input_disabled": true,
						"call_to_actions":[
							{
								"title":"Mio Portaportese",
								"type":"nested",
								"call_to_actions":[
									{
                    "title":"Guarda gli annunci online",
                    "type":"nested",
                    "call_to_actions":[
                      {
                        "title":"Cancella un annuncio",
                        "type":"postback",
                        "payload":"DEL_ANNUNCIO_PL"
                      },
                      {
                        "title":"Conferma un annuncio",
                        "type":"postback",
                        "payload":"PAYBILL_PL"
                      },
                      {
                        "title":"Metti un annuncio in evidenza",
                        "type":"postback",
                        "payload":"HL_ANNUNCIO_PL"
                      }
                    ]
									},
									{
										"title":"Pay Bill",
										"type":"postback",
										"payload":"PAYBILL_PL"
									},
									{
										"title":"History",
										"type":"postback",
										"payload":"HISTORY_PAYLOAD"
									}
								]
							},[
								{ 
									"title":"Restart",
									"type":"postback",
									"payload":"STAGE_RESTART_PL"
								},
								{
									"type":"web_url",
									"title":"Latest News",
									"url":"http://www.messenger.com/",
									"webview_height_ratio":"full"
								},
								{
									"title":"About Portaportese bot",
									"type":"postback",
									"payload":"ABOUT_PL"
								}

								]
						]
					},
					{
						"locale":"en_US",
						//"composer_input_disabled":false,
						"call_to_actions":[
							{
								"title":"Pay Bill",
								"type":"postback",
								"payload":"PAYBILL_PAYLOAD"
							}
						]    
					}
				]
			}
		},
		(err, res, body) => {
			if (!err) {
				console.log(`persistent menu up`);
			} else {
				console.error("unable to set persistent menu:" + err);
			}
		}
	);
}