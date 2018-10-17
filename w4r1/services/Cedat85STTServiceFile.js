/**
 *
 */

const WebSocket = require('ws');
const EventEmitter = require('events');
const fs = require('fs');
const CEDAT85_STT_ENDPOINT = "ws://voicenote.trascrivi.com/ws/client/speech?key=X31CEIVH9G&model=it-IT_16k";
const ONPEN_STRING = '{"audio-type":"s16le;16000","decoding":"start","do-endpointing":true,"do-wordalingnment":true,"n-best":5,"timeout":30,"traceback-period":0.5}';
var wsvar;
Cedat85SpeechToTextService = function(){
	console.log('START STT');

	class WsEmitter extends EventEmitter {}
	const ws = new WebSocket(CEDAT85_STT_ENDPOINT);
	const wsEmitter = new WsEmitter();
	wsEmitter.on('ready',function stream(){
		console.log("READY");

	});


	ws.on('open', function open() {
	  ws.send(ONPEN_STRING);
	});

	ws.on('message', function incoming(data) {
	  console.log(data);
	  var msg = JSON.parse(data);
	  if(msg.status =='ready'){
		  console.log("ok");
		  wsEmitter.emit('ready');
	  }
	});
	this.ws=ws;
	wsvar=ws;

}

var tmp = true;


Cedat85SpeechToTextService.prototype.sendAudio = function(b){

	console.log('CEDAT sendAudio: ',b);
	wsvar.send(b);

  	//this.ws.send(buffer);
	//if(tmp){
	//	tmp = false;
	//	var readStream = fs.createReadStream('./resources/test.wav');
	//	readStream.on('data', function (chunk) {
  	//		console.log("lestti: "+chunk.length);
  	//		wsvar.send(chunk);
	//	});

	//}
};






Cedat85SpeechToTextService.prototype.transcribeFile = function(file){

//	var fs = require('fs');
//	var readStream = fs.createReadStream('myfile.txt');
//	readStream.pipe(process.stdout);

//
//
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
		  console.log("lestti: "+chunk.length);
		  ws.send(chunk);
		});
	}

	function streamFileTemp(file,ws){


		var readStream = fs.createReadStream(file);
		readStream.on('data', function (chunk) {
		  console.log("lestti: "+chunk.length);
		  ws.send(chunk);
		});
	}

	var ready = false;


	this.ws.on('open', function open() {
	  ws.send(ONPEN_STRING);
	});

	this.ws.on('message', function incoming(data) {
	  console.log(data);
	  if(!ready){
		  console.log("ok");
		  ready = true;

		  wsEmitter.emit('ready');
	  }
	});



}

module.exports = Cedat85SpeechToTextService;
