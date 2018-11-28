/**
 * Copyright 2018 IBM Corp. All Rights Reserved.
 *
 */

 'use strict';

//var Yarp= require('../yarp.js/yarp');
var Yarp = require('YarpJS');
var YarpUtils = require('../utils/YarpUtils.js');
var fs = require('fs');
var sleep = require('system-sleep');

/**
 * @class
 * @classdesc R1Client, a test client simulating R1
 */
function R1Client(){
	var self = this;
	//creating ports
	this.cmdPortOut = Yarp.Port('bottle');
	this.cmdPortIn = Yarp.Port('bottle');
	this.soundPortOut = Yarp.Port('sound');
	this.soundPortOut.setStrict(true);
	this.soundPortIn = Yarp.Port('sound');
	this.soundPortIn.setStrict(true);
	this.soundPortIn.onRead(function(msg){
              	var payload = msg.toSend().content;
                console.log("R1 received sound: ",payload.length,payload);
		self.fws.write(payload);
        });

  	this.cmdPortIn.onRead(function(msg){
                var payload = msg.toSend().content[0];
                payload = YarpUtils.decodeBottleJson(payload);
                console.log("R1 command received: ",payload);
        });

	this.fws     = fs.createWriteStream("./resources/tts.wav");
	this.fws.on('error',function(err){console.log(err);});

}


R1Client.prototype.connect = function() {
	console.log("R1 Client connecting to W4R1");
	//opening ports
	this.cmdPortOut.open('/r1/cmd.o');
	this.cmdPortIn.open('/r1/cmd.i');
	this.soundPortOut.open('/r1/sound.o');
	this.soundPortIn.open('/r1/sound.i');
	//connecting
	Yarp.Network.connect('/r1/sound.o','/w4r1/sound.i');
    Yarp.Network.connect('/r1/cmd.o','/w4r1/cmd.i');
    Yarp.Network.connect('/w4r1/cmd.o','/r1/cmd.i');
	Yarp.Network.connect('/w4r1/sound.o','/r1/sound.i');
}


// TESTS FUNCTIONS //

R1Client.prototype.testAudio = function() {
	console.log("R1 STREAMING File");
	var self = this;
	var n =0;
	var readStream = fs.createReadStream('./resources/provaVadim.wav',{ highWaterMark: 4 * 1024 });
			readStream.on('data', function (chunk) {
				//console.log("R1 sending: ",n,chunk.length,chunk);
				console.log("R1 sending: ",n,chunk.length);
				n++;
				sleep(5); //sleeps a bit to simulate real speach rate
			  	self.soundPortOut.write(chunk);
			});
}

R1Client.prototype.testStartConversation = function() {
	console.log("R1 Starting new conversation");
	var msg = { 'status':'conv_start' };
	console.log("R1 sending: ",msg);
	this.cmdPortOut.write(YarpUtils.encodeBottleJson(msg));
}

R1Client.prototype.testNotifyTunrCompleted = function(){
	console.log("R1 Sending turn completed notification");
	var msg = { status : "turn_completed"};
	this.cmdPortOut.write(YarpUtils.encodeBottleJson(msg));
}

module.exports = R1Client;
