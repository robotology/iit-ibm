/**
 * Copyright 2018 IBM Corp. All Rights Reserved.
 *
 */

'use strict';

//var Yarp= require('../yarp.js/yarp');
var Yarp = require('YarpJS');
var Cedat85SpeechToTextService = require('./Cedat85STTService');
var AssistantService = require('./AssistantService');

function W4R1(){

	//STT Sevice
	var stt = new Cedat85SpeechToTextService();
	this.stt = stt;

	this.stt.on('ready',(msg)=>{
		console.log("W4R1 received STT Ready Event: ",msg);

	});
	this.stt.on('transcript',(msg)=>{
		console.log("WR1 received STT Transcript available: ",msg); 
	
	});


	//Assistant Service
	this.assistant = new AssistantService();
	this.assistanContext = {};
	
	//STT Service


	//Yarp communication
	var soundPortIn = new Yarp.Port('sound');
	soundPortIn.open('/w4r1/sound.i');
	soundPortIn.setStrict(true);
	this.cmdPortOut = new Yarp.Port('bottle');
	this.cmdPortOut.open('/w4r1/cmd.o');

	this.cmdPortOut = new Yarp.Port('bottle');
	this.cmdPortOut.open('/w4r1/cmd.o');

	var cmdPortIn = new Yarp.Port('bottle');
	cmdPortIn.open('/w4r1/cmd.i');


	var n = 0;
	var self = this;

	soundPortIn.onRead(function(msg){

		//Receiving from Yarp Speech Sender
		console.log("W4R1 received: ",n,msg.toSend().content.length,msg.toSend(),msg.toSend().content); 
		n++;
		//console.log("W4R1 received from yarp-speech-sender: ",msg.toSend().content[0]); n++;

		self.sendAudio(msg.toSend().content);

	});


	cmdPortIn.onRead(function(msg){
		console.log("RECEIVED COMMAND");
		console.log("W4R1 command received: ",msg.toString());
		self.handleCmdIn(JSON.parse(cmd));
	});


	this.cmdPortIn=cmdPortIn;
	this.soundPortIn = soundPortIn;

}


W4R1.prototype.sendAudio = function(buffer) {
	//console.log("WR1 received: ",buffer);
	this.stt.sendAudio(buffer);
}

W4R1.prototype.sendMessage = function(msg){
	console.log("W4R1: received message",msg);
	var input = { text: msg };
	var self = this;
	this.assistant.message(input,this.context,function(err,data){
		if(err){return;} //TODO handle ERROR
		//console.log("W4R1 assistant reply received: ",data);
		var outputText = data.ouput.text.join(' ');
		console.log("W4R1: reply text",outputText);
		self.context = data.context;	
	}); 
}

W4R1.prototype.handleCmdIn= function(cmd){
	/* COMMAND TEMPLATE
	 * {
         * 	status: conv_start ! conv_end | turn_completed
	 * 	notify: done | error
	 * 	action: <action_name>
	 *      action_params: { <param>:<value>... } 
         * }
         */
	
	var status=getStratus(cmd);
	switch(status){
	//START_CONVERSATION
       		case "conv_start":
			startNewConversation();
			break;	
//TODO is needed?
//		case "conv_end":
//			closeConversation();
//			break;
		case "turn_completed":
			onTurnCompleted();
			break;

	}
}

function getStatus(cmd){return cmd.status};

function startNewConversation(){
	this.context = {};
}

function onTurnCompleted(){
}

W4R1.prototype.connect = function() {
	console.log("R1 connecting to W4R1");
	Yarp.Network.connect('/r1/cmd.o','/w4r1/cmd.i');
	Yarp.Network.connect('/w4r1/cmd.o','/r1/cmd.i');

}


module.exports = W4R1;
