/**
 * Copyright 2018 IBM Corp. All Rights Reserved.
 *
 */

 'use strict';

//var Yarp= require('../yarp.js/yarp');
var Yarp = require('YarpJS');
var fs = require('fs');
var sleep = require('system-sleep');

/**
 * @class
 * @classdesc R1Client, a test client simulating R1
 */
function R1Client(){
	//creating ports
	this.cmdPortOut = new Yarp.Port('bottle');
	this.cmdPortIn = new Yarp.Port('bottle');
	this.soundPortOut = new Yarp.Port('sound');
	this.soundPortOut.setStrict(true);
}


R1Client.prototype.connect = function() {
	console.log("R1 Client connecting to W4R1");
	//opening ports
	this.cmdPortOut.open('/r1/cmd.o');
	this.cmdPortIn.open('/r1/cmd.i');
	this.soundPortOut.open('/r1/sound.o');
	//connecting
	Yarp.Network.connect('/r1/sound.o','/w4r1/sound.i');
        Yarp.Network.connect('/r1/cmd.o','/w4r1/cmd.i');
        Yarp.Network.connect('/w4r1/cmd.o','/r1/cmd.i');
}


// TESTS FUNCTIONS //

R1Client.prototype.testAudio = function() {
	console.log("R1 STREAMING File");
	var self = this;
	var n =0;
	var readStream = fs.createReadStream('./resources/test_R1.wav',{ highWaterMark: 4 * 1024 });
			readStream.on('data', function (chunk) {
				//console.log("R1 sending: ",n,chunk.length,chunk);
				console.log("R1 sending: ",n,chunk.length);
				n++;
				sleep(5); //sleeps a bit to simulate real speach rate
			  	self.soundPortOut.write(chunk);
			});
}


module.exports = R1Client;
