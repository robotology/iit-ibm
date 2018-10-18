/**
 *
 */
var Yarp= require('../yarp.js/yarp');
//var Yarp = require('YarpJS');

function W4R1(){

var Cedat85SpeechToTextService = require('./Cedat85STTService');
	var stt = new Cedat85SpeechToTextService();
	this.stt = stt;
	var soundPortIn = new Yarp.Port('sound');
	soundPortIn.open('/w4r1/sound.i');

	this.cmdPortOut = new Yarp.Port('bottle');
	this.cmdPortOut.open('/w4r1/cmd.o');

	var cmdPortIn = new Yarp.Port('bottle');
	cmdPortIn.open('/w4r1/cmd.i');


	var n = 0;
	var self = this;

	soundPortIn.onRead(function(msg){
		//console.log("RECEIVED SOUND BUFFER");
		//console.log("W4R1 audio received: ",msg.toSend().content);
		//var buffer = new Buffer(msg.toSend().content);

		//console.log("W4R1 received: ",n,msg.toSend().content.length,msg.toSend().content[0]); n++;
		//console.log("W4R1 received: ",n,msg.toSend().content); n++;


		//Receiving from Yarp Speech Sender
		console.log("W4R1 received: ",n,msg.toSend().content.length); n++;
		console.log("W4R1 received from yarp-speech-sender: ",msg.toSend().content[0]); n++;

		self.sendAudio(msg.toSend().content);

	});


	cmdPortIn.onRead(function(msg){
		console.log("RECEIVED COMMAND");
		console.log("W4R1 command received: ",msg.toString());
	});


	this.cmdPortIn=cmdPortIn;
	this.soundPortIn = soundPortIn;

}


W4R1.prototype.sendAudio = function(buffer) {
//	console.log("WR1 received: ",buffer);
//	this.stt.sendAudio(buffer);
}

W4R1.prototype.connect = function() {
	console.log("R1 connecting to W4R1");
	Yarp.Network.connect('/r1/cmd.o','/w4r1/cmd.i');
	Yarp.Network.connect('/w4r1/cmd.o','/r1/cmd.i');

}


module.exports = W4R1;
