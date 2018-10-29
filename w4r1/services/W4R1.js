/**
 * Copyright 2018 IBM Corp. All Rights Reserved.
 *
 */

'use strict';

var Yarp = require('YarpJS');
var YarpUtils = require('../utils/YarpUtils.js');
var Cedat85SpeechToTextService = require('./Cedat85STTService');
var AssistantService = require('./AssistantService');
var AudioConverter = require('../utils/AudioConverter');

/**
 * @class
 * @classdesc W4R1 - Watson For R1
 */
function W4R1(){

	var self = this;

	//STT Sevice
	var stt = new Cedat85SpeechToTextService();
	this.stt = stt;
	//haldling STT Events
	this.stt.on('ready',(msg)=>{
		console.log("W4R1 received STT Ready Event: ",msg);

	});
	this.stt.on('transcript',(msg)=>{
		if(msg.final==true) {
			console.log("WR1 received STT FINAL Transcript available: ",msg.transcript); 
			handleSttiFinalTranscript(self,msg.transcript); 
		}	
		else { 
			console.log("WR1 received STT PARTIAL Transcript: ",msg.transcript);
			handleSttiPartialTranscript(self,msg.transcript); 
		}
	});

	//Audio Converter (IN)	
	this.audioConverter = new AudioConverter();
	this.audioConverter.on('data',function(data){
		console.log("CHUNK CONVERTED");
		self.sendAudio(data);

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
		//console.log("W4R1 received: ",n,msg.toSend().content.length,msg.toSend().content); 
		console.log("W4R1 received: ",n,msg.toSend().content.length); 
		n++;

		self.convertAndSendAudio(msg.toSend().content);

	});


	cmdPortIn.onRead(function(msg){
		var payload = msg.toSend().content[0];
		console.log("W4R1 command received: ",payload);
		payload = YarpUtils.decodeBottleJson(payload);
		self.sendCmd(payload);
	});


	this.cmdPortIn=cmdPortIn;
	this.soundPortIn = soundPortIn;

}


W4R1.prototype.sendAudio = function(buffer) {
	this.stt.sendAudio(buffer);
}

W4R1.prototype.convertAndSendAudio = function(buffer) {
	this.audioConverter.write(buffer);
}

W4R1.prototype.sendMessage = function(msg){
	console.log("W4R1: received message",msg);
	var input = { text: msg };
	var self = this;
	this.assistant.message(input,this.context,function(err,data){
		console.log("W4R1 assistant reply received");//,data);
		handleAssistantReply(self,err,data);	
	}); 
}


function handleAssistantReply(self,err,data){
		//ERROR
		if(err){
			handleErrorReply(self,err);	
			return;
		}
		//VOICE REPLY	
		var outputText = data.output.text.join(' ');
		handleVoiceReply(self,outputText);
		//ACTIONS AND BEHAVIOUR REPLY
		self.context = data.context;
		handleActionsReply(self,self.context);		
} 

function handleErrorReply(self,err){
	 //TODO handle ERROR
	console.log("W4R1: handling error: ",err);
}

function handleVoiceReply(self,text){
	console.log("W4R1: reply text",text);
}

function handleActionsReply(self,context){

}

function handleSttiFinalTranscript(self,text){
	//TODO avoid to receive multiple requests.. e.g. turn off sst and/or listening
	//lf.sendMessage(msg.transcript); //TODO EBABLE THIS LINE TO ALLOW CONVERSATION
}

function handleSttiPartialTranscript(self,text){
	//NOOP
}

W4R1.prototype.sendCmd= function(cmd){
	/* COMMAND TEMPLATE
	 * {
         * 	status: conv_start ! conv_end | turn_completed
	 * 	notify: done | error
	 *	results: {<parm>:<value>}
	 * 	action: <action_name>
	 *      action_params: { <param>:<value>... } 
         * }
         */
	
	var status=_getStatus(cmd);
	switch(status){
	//START_CONVERSATION
       		case "conv_start":
			startNewConversation(this);
			break;	
		case "conv_end":
			closeConversation(this);
			break;
		case "turn_completed":
			onTurnCompleted(this);
			break;
		default:
			
			break;
	}
}

function _getStatus(cmd){
	return cmd.status
};


function startNewConversation(self){
	console.log("W4R1: Starting new conversation");
	setContext(self,{});
	self.sendMessage("c_start");	
}

function onTurnCompleted(self){
//TODO listen again (if conversation is not ended
}

function closeConversation(self){

}

function setContext(self,context){
	console.log("W4R1: ovverriding context",context);
	self.context = context;
}


/*
W4R1.prototype.connect = function() {
}
*/


module.exports = W4R1;
