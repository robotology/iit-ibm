var EventEmitter = require('events');
var Stream = require('stream');
var SoxCommand = require('sox-audio');
var StreamChunker = require('./StreamChunker');

/**
 * @class
 * @classdesc Utility class for converting audio
 */
function AudioConverter(config){
	this.chunker = new StreamChunker();
	var self = this;

	//input strams to read incoming buffers
        this.inStream = new Stream();
        this.inStream.readable = true;

	//output stream waiting for converted bufffers
	this.outStream = new Stream();
	this.outStream.writable = true;
	this.outStream.write = function(chunk){
 		//emitting 'data' event upon conversion
        	//console.log("Converted chunk: ",chunk.length,chunk);
		self.emit('data',chunk);
	}


this.outStream.end = function(){
console.log("END OUT STREAM AUDIOCONVERTER");
	self.emit('end');
}

	//SOX conversoin settings
	this.command = SoxCommand();
	this.command.input(this.inStream);




	//TODO GESTIRE MEGLIO CON LA CONFIGURAZIONE
	//this.command.output(this.outStream);
	//this.command.output(this.chunker);
	//this.chunker.pipe(this.outStream);
	if(config == "r12w4r1"){
		this.command.output(this.outStream);
		_init_r12w4r1(this.command);
	}
	else {
		if(config == "w4r12r1"){
			this.command.output(this.chunker);
			this.chunker.pipe(this.outStream);
			_init_w4r12r1(this.command);
		}
		else {} //TODO handle error
	}

	//logging SOX error
	this.command.on('error', function(err, stdout, stderr) {
  		console.log('Cannot process audio: ' + err.message);
  		console.log('Sox Command Stdout: ', stdout);
		console.log('Sox Command Stderr: ', stderr)
	});

	//Startig SOX converter (Spawn process)

/* example to add arguments to sox
this.command.__getArguments = this.command._getArguments;
var c = this.command;
this.command._getArguments = function() {return ['--buffer','1024'].concat(c.__getArguments());};
console.log("AAAAAAAAAAA: ",this.command._getArguments());
*/
	this.command.run();
}

function _init_r12w4r1(command){ //r1 16000 16 8
	this.buferSize=-1;
	command.inputSampleRate(44100)
  	 .inputEncoding('signed')
  	 .inputBits(16)
  	 .inputChannels(1)
  	 .inputFileType('raw');
  	command.outputSampleRate(16000)
  	 .outputEncoding('signed')
  	 .outputBits(16)
 	  // .outputChannels(1)
  	 .outputFileType('wav');
	 //command.addEffect('remix','7,8');
	 //NOTE:
	 //selects usefull audio channells
	 //selecting only meaningufull channels
	 //(mixing empy ones causes the volume to be lowered)
	 //during test channes 1 and 2 apperas in position 7 end 8.
}

function _init_w4r12r1(command){
//	this.bufferSize = 4096;
//	this._buffer = new Buffer(bufferSize);
//	this._tmpBuff = new Buffer();
//	this.position = 0;
        command.inputSampleRate(22050)
         .inputEncoding('signed')
         .inputBits(16)
         .inputChannels(1)
         .inputFileType('raw');
        command.outputSampleRate(44100)
         .outputEncoding('signed')
         .outputBits(16)
         .outputChannels(2)
         .outputFileType('wav');
     //    command.addEffect('remix','7,8');
         //NOTE:
         //selects usefull audio channells
         //selecting only meaningufull channels
         //(mixing empy ones causes the volume to be lowered)
         //during test channes 1 and 2 apperas in position 7 end 8.
}


AudioConverter.prototype.__proto__ = EventEmitter.EventEmitter.prototype; //inheredits EventEmitter functions

AudioConverter.prototype.write = function(buffer){
//	if(this.bufferSize<0){
		this.inStream.emit('data',buffer);
//	} else {


//	}
}

AudioConverter.prototype.end = function(){
	this.inStream.emit('end');
};


module.exports = AudioConverter;
