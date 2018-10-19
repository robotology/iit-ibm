/**
 * Copyright 2018 IBM Corp. All Rights Reserved.
 *
 */

'use strict';

var express = require('express'); // app server
var bodyParser = require('body-parser'); // parser for post requests
var sleep = require('system-sleep');


/**********************************/
/****** IBM-CEDAT SERVICES ********/
/**********************************/
var AssistantService = require('./services/AssistantService');
var TextToSpeechService = require('./services/TextToSpeechService');
var Cedat85SpeechToTextService = require('./services/Cedat85STTService');

var assistant = new AssistantService();
var stt = new Cedat85SpeechToTextService();
//var textToSpeech = new TextToSpeechService();


var app = express();
// Bootstrap application settings
app.use(express.static('./public')); // load UI from public folder
//app.use(bodyParser.json());

/**********************************/
/********* R1 TEST CLIENT *********/
/**********************************/
console.log("Starting R1 Client");
var R1Client = require('./services/R1Client');
var r1Client = new R1Client();

/**********************************/
/********* WATSON FOR R1 **********/
/**********************************/

console.log("Starting W4R1");
var W4R1 = require('./services/W4R1');
var w4r1 = new W4R1();
//Ports connection
w4r1.connect();


console.log("sleeping");
//stt.sendAudio();
//sleep(1000);

//IBM R1 Client function
//R1_client_fromApp(r1Client);


/**********************************/
/************ APP.GET *************/
/**********************************/


app.get('/api/test',function(req,res){ r1Client.testAudio(); res.send("OK"); });

// Endpoint to be call from the client side
app.post('/api/message', function (req, res) {

  var payload =req.body;
  // Send the input to the assistant service
  assistant.message(payload.input,payload.context,
		  function(err,data){
	  			return handleGenericCallback(err,data,payload,res);
		  }

  );
});

app.get('/api/synthesize', function (req, res) {
	textToSpeech.synthesize(req.query.text,res);

});

app.get('/api/test_stt', function (req, res) {

	var stt = new Cedat85SpeechToTextService();
	stt.transcribeFile(null);

	//res.send("OK");
});

/**********************************/
/*********** FUNCTIONS ************/
/**********************************/

let handleGenericCallback = function(err,data,payload,res){
	if (err) {
	      return res.status(err.code || 500).json(err);
	}
	return res.json(updateResponse(payload, data));
}


/**
 * Updates the response
 * @param  {Object} input The request
 * @param  {Object} response The response service
 * @return {Object}          The response with the updated message
 */
function updateResponse(input, response) {
	//placeholder if it is needed to update response
	// e.g merge some imput data into the output response (within input may occur some extra fields that the system needs to send back in the response)
	//e.g. add some any tumpering stuff
  return response;
}

function R1_client_fromApp(r1Client) {
    r1Client.connect();
    console.log("sending audio");
    r1Client.testAudio();
}

module.exports = app;
