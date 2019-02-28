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
var fs = require('fs');
const log = require("log").get("w4r1");
var spawn = require('child_process').spawn;
var sleep = require('sleep');

//Settings
const SENDER_PATH = "./ext/build/Sender";
const RECEIVER_PATH = "./ext/build/Receiver";
const USE_EXT_AUDIO_IN = true;
const USE_EXT_AUDIO_OUT = false; //NOT WORKING
const DUMP_AUDIO = true;
const ENABLE_LIPS = false;

//ports
const PORT_LIPS_I = "/w4r1/lips.i";

const LIPS_SPEAK = "parla";

/**
 * @class
 * @classdesc W4R1 - Watson For R1
 */
function W4R1(){
        log.info("*** Starting W4R1 ***");
	var self = this;

	if(DUMP_AUDIO){
		log.warn("Audio Dump active");
		this.fws     = fs.createWriteStream("./resources/stt.wav");
		this.fws.on('error',function(err){console.log(err);});
		this.fwsin     = fs.createWriteStream("./resources/sttin.wav");
		this.fwsin.on('error',function(err){console.log(err);});
	}

	
	this.w4r1listen = false;

	//init internal status.
	_setSpeaking(this,false);
	_setDoing(this,false);

	//STT Service
	this.stt = new Cedat85SpeechToTextService();
	//haldling STT Events
	this.stt.on('ready',(msg)=>{
		console.log("W4R1 received STT Ready Event: ",msg);
	});
	this.stt.on('transcript',(msg)=>{
		if(msg.final==true) {
            +new Date;
            console.log('MILLISECONDS FINAL TRANSCRIPT',Date.now());
			console.log("WR1 received STT FINAL Transcript available: ",msg.transcript);
			handleSttFinalTranscript(self,msg.transcript);
		}
		else {
            //+new Date;
            //console.log('MILLISECONDS PARTIAL TRANSCRIPT',Date.now());
			console.log("WR1 received STT PARTIAL Transcript: ",msg.transcript);
			handleSttPartialTranscript(self,msg.transcript);
		}
	});

	//NOTE: Audio Converters need to be initialized before starting
	//Audio Converter (IN) will be initialized just before receiving audio
	//Audio Converter (OUT) will be initialized just before sending audio

	//Output Stream waiting for data from TextToSpeach 
    	this.ttsOutStream = new Stream();
    	this.ttsOutStream.writable = true;
    	this.ttsOutStream.write = function(chunk){
        	//forwarding 'chunk' to out converter
            	//console.log("W4R1 received TTS: ",chunk.length); //,chunk);

		self.audioConverterOut.write(chunk); //the converter emits 'data' events upon conversion
    	}
	this.ttsOutStream.end = function(){
		console.log("W4R1: received TTS END");
		_setSpeaking(self,false);
		self.audioConverterOut.end(); //close audioconverter	
	}


	//Assistant Service
	this.assistant = new AssistantService();
	this.assistanContext = {};


	//TTS Service
	this.tts = new TextToSpeechService();


	//Yarp communication

	//SOUND
	if(USE_EXT_AUDIO_IN){
		var inArgs = {};
		var inOptions = {};
		var soundProcIn =  spawn(RECEIVER_PATH, inArgs, inOptions);
		soundProcIn.on('exit', function(code, signal) {
			console.log("W4R1 SOUND PROC HAS EXITED");
		});
		var n=0;
		soundProcIn.stdout.on('data', function(data) {
			n++;
			console.log(n,data.length);
			self.convertAndSendAudio(data);
		});
		soundProcIn.stdout.on('close', function() {});
		soundProcIn.stderr.on('data', function(data)
		{
			console.log('data: ', data.toString('utf8'));
		});
		this.soundProcIn = soundProcIn;
	}
	else {
		var soundPortIn = Yarp.Port('sound');
		soundPortIn.open('/w4r1/sound.i');      	
        soundPortIn.setStrict(true);
		var n = 0;
		soundPortIn.onRead(function(msg){
			//Receiving from Yarp Speech Sender
			//console.log("W4R1 received: ",n,msg.toSend().content.length,msg.toSend().content);
			n++;
			self.convertAndSendAudio(msg.toSend().content);
		});
		this.soundPortIn = soundPortIn;

	}
	if(USE_EXT_AUDIO_OUT){
		var outArgs = {};
		var outOptions = {};
		var soundProcOut = spawn(SENDER_PATH,outArgs, outOptions);
		soundProcOut.on('exit', function(code, signal) {});
		this.soundProcOut = soundProcOut;
	}
	else {
		this.soundPortOut = Yarp.Port('sound');
		this.soundPortOut.open('/w4r1/sound.o');
		this.soundPortOut.setStrict(true);
	}

	//LIPS Sevice (like HotWord detection)
	if(ENABLE_LIPS){this.lipsExpected = false;}
	else { this.lipsExpected = false; } //chane here if needed for conversation start
	var lipsPortIn = Yarp.Port('bottle');
	lipsPortIn.open(PORT_LIPS_I);
	lipsPortIn.onRead(function(msg){
		var payload = msg.toSend().content[0];
		log("Lips received: ",payload);
		if(payload == LIPS_SPEAK){
			if(self.lipsExpected){
				self.lipsExpected = false;
				startListening(self);			
			} 
		}
		
	});


	//CMD Ports
	this.cmdPortOut = Yarp.Port('bottle');
	this.cmdPortOut.open('/w4r1/cmd.o');
	//
	var cmdPortIn = Yarp.Port('bottle');
	cmdPortIn.open('/w4r1/cmd.i');
	cmdPortIn.onRead(function(msg){
		var payload = msg.toSend().content[0];
		console.log("W4R1 command received: ",payload);
		payload = YarpUtils.decodeBottleJson(payload);
		self.sendCmd(payload);
	});
	this.cmdPortIn=cmdPortIn;

}


W4R1.prototype.sendAudio = function(buffer) {
	if(this.w4r1listen){
		if(DUMP_AUDIO){
			console.log("_send audio");
			this.fws.write(buffer);
		}
		console.log("_send audio 2");
		this.stt.sendAudio(buffer);
	}else {
		console.log('W4R1 -audio dropped(2)- ');
		}
}

W4R1.prototype.convertAndSendAudio = function(buffer) {
	log('W4R1 ricevuto da R1: ',buffer.length, "=>", buffer[0]);
	if(DUMP_AUDIO){
		this.fwsin.write(buffer);
	}
	if(this.w4r1listen){
		this.audioConverterIn.write(buffer);
	} else {
		console.log('W4R1 -audio dropped- ');	
	}
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
	log("W4R1 streaming: ",text);
	
	this.tts.stream(text,this.ttsOutStream,null);
}

function handleAssistantReply(self,err,data){
		//ERROR
		if(err){
			handleErrorReply(self,err);
			return;
		}
		//REPLY
		var outputText = data.output.text.join(' ');
		var action = data.context.action;
		var action_params = data.context.action_params;
		_cleanContextReply(data.context);
		self.context = data.context;
		//Conversation Actions handler placeholder.
		//performAction(self,self.context,callback);.


		//CHECK HotWord need
		
		
		if(ENABLE_LIPS){
			if(data.context.system.dialog_stack[0].dialog_node=="root"){
				log.debug("Waiting for Lips movement");
				self.lipsExpected = true;
				}
		}
		/*
		"context": {
		    "conversation_id": "a96ec62f-773c-4e84-8be9-f9dbca9f83d0",
		    "system": {
		      "dialog_stack": [
			{
			  "dialog_node": "root"
			}
		      ],
		*/

		//ACTIONS AND BEHAVIOUR REPLY
		handleReply(self,outputText,action,action_params);
}

function _cleanContextReply(context){
	if(context.R1) delete context.R1;
	if(context.action) delete context.action;
	if(context.action_params) delete context.action_params;
}

function _prepareContext(cmd,context){
		context.R1 = {};
		if(cmd.action_status)
			context.R1.action_status = cmd.action_status;
		if(cmd.action_results)
			context.R1.action_results = cmd.action_results;
}



function handleReply(self,outputText,action,action_params){  //TODO prestare attenzione a come richiedere/gestire la notifica di fine turno




	handleActionsReply(self,action,action_params);
	handleVoiceReply(self,outputText);



}

function handleErrorReply(self,err){
	 //TODO handle ERROR
	console.log("W4R1: handling error: ",err);
}


function handleVoiceReply(self,text){
	console.log("W4R1: handling voice reply: ",text);

	if(text.length>0) {
		_setSpeaking(self,true);
		_initAudioConverterOut(self);
		self.streamReply(text);
	}
	else {
		//Simulating end turn here
		log("Empty message");
		endTurn(self);
	}

}

function handleSendAudio(self,chunk){
	if(USE_EXT_AUDIO_OUT)
		self.soundProcOut.stdin.write(chunk);
	else
    {
       // var d = new Date();
        +new Date;
            
        var t1 = Date.now();
        
       // self.soundPortOut.writeStrict(chunk);
        self.soundPortOut.write(chunk);
        self.soundPortOut.waitForWrite();
        var t2 = Date.now();

        var tdiff = t2-t1;
        console.log("Time spent in sending data: ",tdiff);
    }
}

function handleActionsReply(self,action,action_params){
	if(action){
		log("Handling action: ",action);
		_setDoing(self,true);
		var params = (action_params)?action_params:{};
		executeAction(self,action,params);	
	}
}


function executeAction(self,action,params){
	log("Executing Action: ",action,"; Params: ",params);
	if(action.startsWith('w4r1')){
		executeInternalAction(self,action,params);
			
	} else {
		//R1 Actoion
		var msg = {action:action};
		msg.action_params = params;
		self.cmdPortOut.write(YarpUtils.encodeBottleJson(msg));
	}
}

function executeInternalAction(self,action,params){
	if(action == "w4r1_switch_skill"){
		var done = false;
		if(params.skill_id){
		 done = self.assistant.switch_skill(params.skill_id);
		}
		if(done){
			//start a new conversation
			_setDoing(self,false);
			self.context.W4R1 = {};
			self.context.W4R1.restart = true;
			endTurn(self);
			
		}else {
			//send ad error	
			endAction(self,{action_status:"error"});	
		}
	}
}

function handleSttFinalTranscript(self,text){
	if(!self.w4r1listen) return;
	stopListening(self);
	self.sendMessage(text);
}

function handleSttPartialTranscript(self,text){
	//NOOP
}

W4R1.prototype.sendCmd= function(cmd){
	/* MESSAGE TEMPLATE  R1 => W4R1
	 * {
         * 	status: conv_start | conv_end | action_completed
	 *	results: {<parm>:<value>}
	 * 	action: <action_name> //NOT SUPPORTED	
	 *      action_params: { <param>:<value>... } //NOT SUPPORTED	
	 *	action_results: {<any_object>}
	 *	action_status: done | error
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
		case "action_completed":
			//expecting action_status and action_results
			endAction(this,cmd);
			break;		
//		case "turn_completed":
//			endTurn(this,cmd);
//			break;
		default:
			break;
	}
}

function _getStatus(cmd){
	return cmd.status
};


function startNewConversation(self){
	log.info("W4R1: Starting new conversation");
	setContext(self,{});
	self.sendMessage("c_start");
}


function endAction(self,cmd){
	log.info("Action completed: ",cmd);
	_prepareContext(cmd,self.context);
	_setDoing(self,false);
	endTurn(self);
	//TODO
	//funzionamento:
	//2 variablili speaking e doing 
	//quando finisce di parlare controlla se c'è una azione pending e se non c'è abbia il listening/chiude il turno
	//analogamente quando finisce l'azione controlla se sta parlano e se non sta parlando finisce il turno
	//in questo modo l'ultimo dei due che chiama la chiusura effettivamente la fa
	//chiaramente le variabili speaking e doing sono inizializzate a falso
	//le variabili vengono portate a true solo se necessario.
	//prima viene valutata action e poi speaking
	//le variabili vanno messe a vero come prima cosa
	//doing viene messa a vero solo se necessario
}

function endTurn(self){
	console.log("W4R1: End turn received");
	if(_isSpeaking(self)||_isDoing(self)){
		console.log("end turn not possible something is pending");
		return;
	}
	if(self.context.W4R1 && self.context.W4R1.restart){
		startNewConversation(self);	
	}else 
	if(self.context.R1){ //TODO verify and enhance this condition
		console.log("sending action result to assistant");
		self.sendMessage("");
	}
	else
		startListening(self);
}

function closeConversation(self){
	stopListening(self);
}

function setContext(self,context){
	console.log("W4R1: ovverriding context",context);
	self.context = context;
}


function startListening(self){
	
	if(self.lipsExpected) return;
	

	_initAudioConverterIn(self); //TODO assicurarsi che i flussi precedenti siano chiusi
	self.w4r1listen = true;
	if(USE_EXT_AUDIO_IN){
		log("Sending Listen signal SIGUSR1 to Receiver");
		self.soundProcIn.kill('SIGUSR1');
	}
	_notifyListening(self);
}



function stopListening(self){
        self.w4r1listen = false;
	if(USE_EXT_AUDIO_IN){
		log("Sending Stop Listen signal SIGUSR2 to Receiver");
		self.soundProcIn.kill('SIGUSR2');
	}
	self.audioConverterIn.end();
        _notifySilence(self);
}


function _notifySilence(self){
	var msg = {notify:"silence"};
	self.cmdPortOut.write(YarpUtils.encodeBottleJson(msg));
}

function _notifyListening(self){
	//TODO VERIFY that end conversation is correctly handled somewhere
	var msg = {notify:"listen"};
    +new Date;
    console.log('MILLISECONDS NOTIFY LISTEN',Date.now());
	var m = YarpUtils.encodeBottleJson(msg)
	self.cmdPortOut.write(m);
}



 function _initAudioConverterIn(self){
	log("init audio converter IN");
	self.audioConverterIn = new AudioConverter("r12w4r1");  //use r12w4r1 to run on R1; r12w4r1-pc to run on PC
	self.audioConverterIn.on('data',function(data){
		console.log("W4R1 converted (In): ",data.length,data);
		self.sendAudio(data);
	});
	log("init audio converter IN done");
}

function _initAudioConverterOut(self){
	self.audioConverterOut = new AudioConverter("w4r12r1");
	self.audioConverterOut.on('data',function(data){
		console.log("W4R1 converted (Out): ",data.length,data);
                handleSendAudio(self,data);
        });
	self.audioConverterOut.on('end',function(){endTurn(self,{});}); //Here is internally notified that streaming is ended
}

function _setSpeaking(self,isSpeaking){
	self.speaking = isSpeaking;
}
function _isSpeaking(self){ return self.speaking;}


function _setDoing(self,isDoing){
	self.doing = isDoing;
}
function _isDoing(self) { return self.doing};

module.exports = W4R1;
