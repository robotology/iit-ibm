/**
 * W4R1 - Watson For R1.
 *
 * @author IIT, IBM
 *
 */

'use strict';
require("log-node")();
const log = require("log").get("app");
var express = require('express'); // app server
var bodyParser = require('body-parser'); // parser for post requests
var sleep = require('sleep');



var app = express();
// Bootstrap application settings
app.use(express.static('./public')); // load UI from public folder
app.use(bodyParser.json());

/**********************************/
/********* TEST SPEAKER **********/
/**********************************/

//console.log("Test Speaker");
//var Speaker = require('./services/speaker_test');
//var speaker = new Speaker();


/**********************************/
/********* WATSON FOR R1 **********/
/**********************************/

log.info("*** Starting W4R1 APP ***");
var W4R1 = require('./services/W4R1');
var w4r1 = new W4R1();
//sleeps a bit waitng W4R1 to connect to STT (To be optimized)
//log("sleeping");
//sleep.msleep(1000);
log.info("W4R1 Ready to accept connections.");



/***********************************/
/******** TEST CLIENT **************/
/***********************************/

//R1_client_fromApp(); //Only for testing




/**********************************/
/************ APP.GET *************/
/**********************************/


// Endpoint to be call from the client side
var AssistantService = require('./services/AssistantService');
var _assistant = new AssistantService();
app.post('/api/message', function (req, res) {
  var payload =req.body;
  // Send the input to the assistant service
  _assistant.message(payload.input,payload.context,
	function(err,data){
		return handleGenericCallback(err,data,payload,res);
	}
  );
});


// TTS Edpoint
app.get('/api/synthesize', function (req, res) {
	textToSpeech.synthesize(req.query.text,res);

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




/**********************************/
/********* R1 TEST CLIENT *********/
/**********************************/
function R1_client_fromApp() {

	console.log("Starting R1 Client");
	var R1Client = require('./services/R1Client');
	var r1Client = new R1Client();
	//Connection to W4R1
   	r1Client.connect();
    	console.log("---------------------------------------------------");
	sleep.msleep(3000);

	//Starting conversation and receiving welcome message
	console.log("Testing Start Conversation");
	r1Client.testStartConversation();
	sleep.msleep(5000);
    	console.log("---------------------------------------------------");

	//Test end turn
	console.log("Notify end turn");
	r1Client.testNotifyTunrCompleted();
	sleep.msleep(3000);
    	console.log("---------------------------------------------------");

	//Test Assistant
	console.log("Testing Assitant");
	w4r1.sendMessage("vorrei prenotare una visita");
	sleep.msleep(5000);
    	console.log("---------------------------------------------------");

	//Test end turn
	console.log("Testing End turn");
	r1Client.testNotifyTunrCompleted();
	sleep.msleep(3000);
    	console.log("---------------------------------------------------");

	//Test Assistant and STT
	console.log("Testing Audio");
	r1Client.testAudio();
    	console.log("---------------------------------------------------");

sleep.msleep(10000);
console.log("R1 client test end");
}

module.exports = app;
