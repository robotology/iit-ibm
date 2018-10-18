/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var express = require('express'); // app server
var bodyParser = require('body-parser'); // parser for post requests

var AssistantService = require('./services/AssistantService');
var W4R1 = require('./services/W4R1');
var R1 = require('./services/R1');
var assistant = new AssistantService();


var app = express();


// Bootstrap application settings
app.use(express.static('./public')); // load UI from public folder
app.use(bodyParser.json());


app.post('/api/message', function (req, res) {

  var payload =req.body;
  // Send the input to the assistant service
  assistant.message(payload.input,payload.context,
		  function(err,data){
	  			return handleGenericCallback(err,data,payload,res);
		  }

  );
});

app.get('/api/test', function (req, res) {

    var w4R1 = new W4R1();
    var r1 = new R1();
    r1.setW4r1(w4R1);
});



var fs = require('fs');
var yarp = require('./yarp.js/yarp');

app.get('/client/test_sound', function (req, res) {


    var sound_sender_port = new yarp.Port('sound');
    sound_sender_port.open('/R1/sound:o');

    var cmd_sender_port = new yarp.Port('bottle');
    cmd_sender_port.open('/R1/text:o');

    //CONNECTION WITH CONVERSATION
    yarp.Network.connect('/R1/sound:o', '/watsonR1/sound:i');
    yarp.Network.connect('/R1/text:o', '/watsonR1/text:i');

    streamFile('./resources/test.wav',sound_sender_port);

    //var msg='start';
    //cmd_sender_port.write(msg);
});


//Functions

let handleGenericCallback = function(err,data,payload,res){
	if (err) {
	      return res.status(err.code || 500).json(err);
	}
	return res.json(updateResponse(payload, data));
}

function updateResponse(input, response) {
	//placeholder if it is needed to update response
	// e.g merge some imput data into the output response (within input may occur some extra fields that the system needs to send back in the response)
	//e.g. add some any tumpering stuff
  return response;
}

function streamFile(file,port){
    var readStream = fs.createReadStream(file, { highWaterMark: 2 * 1024 });
    readStream.on('data', function (chunk) {
      console.log("invio: "+chunk.length);
      port.write(chunk);
      //console.log('chunk',chunk);      
    });
}

module.exports = app;
