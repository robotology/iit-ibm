/**
 * Copyright 2018 IBM Corp. All Rights Reserved.
 *
 */

'use strict';

var Yarp = require('YarpJS');
var Stream = require('stream');
var YarpUtils = require('../utils/YarpUtils.js');
var Cedat85SpeechToTextService = require('./Cedat85STTService');
var TextToSpeechService = require('./TextToSpeechService');
var AssistantService = require('./AssistantService');
var AudioConverter = require('../utils/AudioConverter');
var sleep = require('system-sleep');

/**
 * @class
 * @classdesc W4R1 - Watson For R1
 */
function W4R1(){
	var self = this;
	this.listen = false;
	//this.firstOutAudio = true;	//TEMPORANEO

	//STT Service
	this.stt = new Cedat85SpeechToTextService();
	//haldling STT Events
	this.stt.on('ready',(msg)=>{
		console.log("W4R1 received STT Ready Event: ",msg);
	});
	this.stt.on('transcript',(msg)=>{
		if(msg.final==true) {
			console.log("WR1 received STT FINAL Transcript available: ",msg.transcript);
			handleSttFinalTranscript(self,msg.transcript);
		}
		else {
			console.log("WR1 received STT PARTIAL Transcript: ",msg.transcript);
			handleSttPartialTranscript(self,msg.transcript);
		}
	});

	//Audio Converter (IN)
	_initAudioConverterIn(this);

	//Audio Converter (OUT) will be initialized just before sending audio
    //output stream waiting for converted bufffers
    this.sttOutStream = new Stream();
    this.sttOutStream.writable = true;
    this.sttOutStream.write = function(chunk){
            //emitting 'data' event upon conversion
            console.log("W4R1 received stt: ",chunk.length,chunk);
			self.audioConverterOut.write(chunk);
    }

	this.sttOutStream.end = function(){
		console.log("W4R1: END STREAMING");
		self.audioConverterOut.end();
	}

//	_initAudioConverterOut(this);

	//Assistant Service
	this.assistant = new AssistantService();
	this.assistanContext = {};


	//TTS Service
	this.tts = new TextToSpeechService();


	//Yarp communication
	var soundPortIn = Yarp.Port('sound');
	soundPortIn.open('/w4r1/sound.i');
	soundPortIn.setStrict(true);
	this.soundPortOut = Yarp.Port('sound');
	this.soundPortOut.open('/w4r1/sound.o');
	this.soundPortOut.setStrict(true);

	this.cmdPortOut = Yarp.Port('bottle');
	this.cmdPortOut.open('/w4r1/cmd.o');

	var cmdPortIn = Yarp.Port('bottle');
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
	if(this.listen)
		this.stt.sendAudio(buffer);
}

W4R1.prototype.convertAndSendAudio = function(buffer) {
	this.audioConverterIn.write(buffer);
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

W4R1.prototype.streamReply = function(text) {
	console.log("W4R1 Streaming: ",text);
	this.tts.stream(text,this.sttOutStream,null);
}

function handleAssistantReply(self,err,data){
		//ERROR
		if(err){
			handleErrorReply(self,err);
			return;
		}
		//REPLY
		var outputText = data.output.text.join(' ');
		_cleanContextReply(data.context);
		self.context = data.context;
		//Conversation Actions handler placeholder.
		//performAction(self,self.context,callback);.

		//ACTIONS AND BEHAVIOUR REPLY
		handleReply(self,outputText,self.context);
}

function _cleanContextReply(context){
	if(context.R1) delete context.R1;
}

function _prepareContext(cmd,context){
		context.R1 = {};
		if(cmd.notify)
			context.R1.notify = cmd.notify;
		if(cmd.results)
			context.R1.results = cmd.results;
}



function handleReply(self,outputText,context){  //TODO prestare attenzione a come richiedere/gestire la notifica di fine turno
	handleActionsReply(self,context);
	handleVoiceReply(self,outputText);
}

function handleErrorReply(self,err){
	 //TODO handle ERROR
	console.log("W4R1: handling error: ",err);
}

function handleVoiceReply(self,text){
	console.log("W4R1: reply text",text);
	if(text.length>0) {
		_initAudioConverterOut(self);
		self.streamReply(text);
	}
	else {
		//TODO simulate end here
	}

}

function handleSendAudio(self,chunk){
//	console.log("W4R1: sending audio: ",chunk.length);
/*	if(self.firstOutAudio==true){
	   self.firstOutAudio=false;
		console.log("W4R1 Sending aging FIRST chunk");
		self.soundPortOut.write(chunk);
	}
*/	sleep(5);
	self.soundPortOut.write(chunk);
}

function handleActionsReply(self,context){

}

function handleSttFinalTranscript(self,text){
	if(!self.listen) return;
	stopListening(self);
	self.sendMessage(text);
}

function handleSttPartialTranscript(self,text){
	//NOOP
}

W4R1.prototype.sendCmd= function(cmd){
	/* MESSAGE TEMPLATE  R1 => W4R1
	 * {
         * 	status: conv_start ! conv_end | turn_completed
	 * 	notify: done | error
	 *	results: {<parm>:<value>}
	 * 	action: <action_name>			//NOT SUPPORTED
	 *      action_params: { <param>:<value>... }	//NOT SUPPORTED
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
			endTurn(this,cmd);
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

function endTurn(self,cmd){
	console.log("W4R1: End turn received");
	if(cmd.notify){
		_prepareContext(cmd,self.context);
		self.sendMessage("");
	}
	else
		startListening(self);
}

function closeConversation(self){
	self.listen = false;
}

function setContext(self,context){
	console.log("W4R1: ovverriding context",context);
	self.context = context;
}

function startListening(self){
	self.listen = true;
	_notifyListening(self);
}

function stopListening(self){
        self.listen = false;
        _notifySilence(self);
}


function _notifySilence(self){
	//TODO VERIFY notify R1 to start listening (if conversation is not ended)
	var msg = {notify:"silence"};
	self.cmdPortOut.write(YarpUtils.encodeBottleJson(msg));
}

function _notifyListening(self){
	//TODO VERIFY notify R1 to start listening (if conversation is not ended)
	var msg = {notify:"listen"};
	self.cmdPortOut.write(YarpUtils.encodeBottleJson(msg));
}

/*
W4R1.prototype.connect = function() {
}
*/

 function _initAudioConverterIn(self){
	self.audioConverterIn = new AudioConverter("r12w4r1");
	self.audioConverterIn.on('data',function(data){
		console.log("W4R1 converted: ",data.length,data);
		self.sendAudio(data);
	});
}

function _initAudioConverterOut(self){
	self.audioConverterOut = new AudioConverter("w4r12r1");
	self.audioConverterOut.on('data',function(data){
		console.log("W4R1 converted: ",data.length,data);
                handleSendAudio(self,data);
        });
}



module.exports = W4R1;
