/**
 *
 */
'use strict';

var WebSocket = require('ws');
var EventEmitter = require('events');
var fs = require('fs');

const CEDAT85_STT_ENDPOINT = "ws://voicenote.trascrivi.com/ws/client/speech?key=X31CEIVH9G&model=it-IT_16k";
const ONPEN_STRING = '{"audio-type":"s16le;16000","decoding":"start","do-endpointing":true,"do-wordalingnment":true,"n-best":5,"timeout":30,"traceback-period":0.5}';


function Cedat85SpeechToTextService(){

	class WsEmitter extends EventEmitter{}
	this.wsEmitter = new WsEmitter();

	var self = this;
	this.wsEmitter.on('ready',function stream(msg){
		console.log("CEDAT READY");
		self.emit('ready',msg);
		//self.sendAudio(null);
	});


	EventEmitter.EventEmitter.call(this);

	this.connect();
}


Cedat85SpeechToTextService.prototype.__proto__ = EventEmitter.EventEmitter.prototype;


Cedat85SpeechToTextService.prototype.connect = function(){
	var self = this;

	this.ws = new WebSocket(CEDAT85_STT_ENDPOINT);
	this.ws.on('open', function open() {
	  self.ws.send(ONPEN_STRING);
	});

	this.ws.on('message', function incoming(data) {
		//CEDAT RESPONSE
		console.log(data);
		
	  	var msg = JSON.parse(data);
	  	var eventMsg = {stt_data:data};

		//handling cedat85 status
	  	if(msg.status !== undefined){
	  		if(msg.status == 'ready'){
		  		self.wsEmitter.emit('ready',eventMsg);
	  		} else if(msg.status == 'error'){
				self.emit('error',eventMsg);
			}
		}
		//handling transcripts
		else if(msg.final !== undefined) {
			if(msg.final == true){
				eventMsg.transcript = msg.transcript;
			} else {
				//TODO extrat best hypothesis here
				//eventMsg.transcript = msg....
			
			}
			eventMsg.final = msg.final;
			self.emit('transcript',eventMsg);
		}
	});
	this.ws.on('close',function(){
		console.log("SOCKET CLOSED reconnecting");
		self.connect();//REMOVE THIS TO AVOID ALWAYS RECONNECTING
	});

}


var temp = true;
Cedat85SpeechToTextService.prototype.sendAudio = function(buffer){
	console.log("Sending to Cedat85");
	this.ws.send(buffer);

	//SENDING WAV FILE AS A STREAM
	/*
		var self = this;
		if(!temp) return;
		temp = false;
		var readStream = fs.createReadStream('./resources/test.wav');
			readStream.on('data', function (chunk) {
			  console.log("sending to Cedat: "+chunk.length);
			  self.ws.send(chunk);
			});

	*/
}


Cedat85SpeechToTextService.prototype.transcribeFile = function(file){
/*
	const BUFFER_SIZE = 16*800;
	var buffer = new Buffer(BUFFER_SIZE);

	const ws = new WebSocket(CEDAT85_STT_ENDPOINT);
	class WsEmitter extends EventEmitter {}

	const wsEmitter = new WsEmitter();

	wsEmitter.on('ready',function stream(){
		console.log("streaming file...");
		streamFile('./resources/test.wav');
	});
	wsEmitter.on('event', () => {
	  console.log('an event occurred!');
	});



	function streamFile(file){

		var readStream = fs.createReadStream(file);
		readStream.on('data', function (chunk) {
		  console.log("letti: "+chunk.length);
		  ws.send(chunk);
		});
	}


	var ready = false;
	ws.on('open', function open() {
		ws.send(ONPEN_STRING);
	});

	ws.on('message', function incoming(data) {
	  console.log(data);
	  if(!ready){
		  console.log("ok");
		  ready = true;

		  wsEmitter.emit('ready');
	  }
	});


*/
}

module.exports = Cedat85SpeechToTextService;
