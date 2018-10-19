/**
 * Copyright 2018 IBM Corp. All Rights Reserved.
 *
 */

 'use strict';

var Yarp= require('../yarp.js/yarp');
//var Yarp = require('YarpJS');
var fs = require('fs');
var sleep = require('system-sleep');

function R1Client(){

	this.cmdPortOut = new Yarp.Port('bottle');
	this.cmdPortOut.open('/r1/cmd.o');

	this.cmdPortIn = new Yarp.Port('bottle');
	this.cmdPortIn.open('/r1/cmd.i');
}


R1Client.prototype.testAudio = function() {
	console.log("R1 STREAMING File");
	var self = this;
	var n =0;
	var readStream = fs.createReadStream('./resources/test.wav',{ highWaterMark: 4 * 1024 });
			readStream.on('data', function (chunk) {
				console.log("R1 sending: ",n,chunk.length,chunk[0]);
				n++;
				sleep(250);
			  	self.soundPortOut.write(chunk);
			});
}


R1Client.prototype.connect = function() {
	console.log("R1 Client connecting to W4R1");

	this.soundPortOut = new Yarp.Port('sound');
	this.soundPortOut.open('/r1/sound.o');
	Yarp.Network.connect('/r1/sound.o','/w4r1/sound.i');
}

module.exports = R1Client;
