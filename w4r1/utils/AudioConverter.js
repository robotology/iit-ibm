var EventEmitter = require('events');
var Stream = require('stream');
var SoxCommand = require('sox-audio');
var StreamChunker = require('./StreamChunker');
var sleep = require('sleep');

/**
 * @class
 * @classdesc Utility class for converting audio
 */
function AudioConverter(config){

	this._config = {};
	if(config == "r12w4r1"){
			this._config.trackDelay = false;
			this._config.out = {
					rate : 16000,
					bits : 16,
					channels: 1,
					encoding : 'signed'		
				   }
	}
	else
	if(config == "w4r12r1"){
			this._config.trackDelay = true;
			this._config.out = {
					rate : 16000,
					bits : 16,
					channels : 1,
					encoding: 'signed'	
				   }
	}


	this.trackDelay = this._config.trackDelay;
	this.estimateEndTimeMS = Date.now(); //only used when trackDelay is true
	
	var self = this;

	//input strams to read incoming buffers
        this.inStream = new Stream();
        this.inStream.readable = true;

	//output stream waiting for converted bufffers
	this.outStream = new Stream();
	this.outStream.writable = true;

	this.outStream.write = function(chunk){

		if(self.trackDelay){
			var delay = Math.round (
						chunk.length/
						( (self._config.out.rate/1000)*(self._config.out.bits/8)*self._config.out.channels ) 
						);
			var now = Date.now();
			//console.log("DELAY: ",delay,self.estimateEndTimeMS-now);
			if( (self.estimateEndTimeMS-now)<=0){self.estimateEndTimeMS=(now+delay);} else {self.estimateEndTimeMS+=delay;}
			//console.log("DELAYNEW: ",self.estimateEndTimeMS-now);
			if( (self.estimateEndTimeMS-now) > (3*delay)) sleep.msleep(self.estimateEndTimeMS-now-(delay*2));
		}
		//
        	//console.log("Converted chunk: ",chunk.length,chunk);
		self.emit('data',chunk); //emitting 'data' event upon conversion
	}

	this.outStream.end = function(){
		console.log("END OUT STREAM AUDIOCONVERTER");
		if(self.trackDelay){
			var delay = self.estimateEndTimeMS - Date.now();
			if(delay>0){
				console.log("WAITING BEFORE END ",delay);
 				sleep.msleep(delay);
			}
		}
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
		_init_r12w4r1(this.command,this._config);
	}
	else {
		if(config == "w4r12r1"){
			this.trackDelay = true;
			this.chunker = new StreamChunker();
			this.command.output(this.chunker);
			this.chunker.pipe(this.outStream);
			_init_w4r12r1(this.command,this._config);
		}
		else {} //TODO handle error
	}

	//logging SOX error
	this.command.on('error', function(err, stdout, stderr) {
  		console.log('Cannot process audio: ' + err.message);
  		console.log('Sox Command Stdout: ', stdout);
		console.log('Sox Command Stderr: ', stderr)
	});

	

		/* example to add arguments to sox
		 * this.command.__getArguments = this.command._getArguments;
		 * var c = this.command;
		 * this.command._getArguments = function() {return ['--buffer','1024'].concat(c.__getArguments());};
		 * console.log("AAAAAAAAAAA: ",this.command._getArguments());
		 */

	//Startig SOX converter (Spawn process)
	this.command.run();
}

function _init_r12w4r1(command,config){ //r1 16000 16 8
	command.inputSampleRate(44100)
  	 .inputEncoding('signed')
  	 .inputBits(16)
  	 .inputChannels(1)
  	 .inputFileType('raw');
  	command.outputSampleRate(config.out.rate)
  	 .outputEncoding(config.out.encoding)
  	 .outputBits(config.out.bits)
 	  // .outputChannels(config.out.channels)
  	 .outputFileType('wav');
	 //command.addEffect('remix','7,8');
	 //NOTE:
	 //select usefull audio channels
	 //selecting only meaningufull channels
	 //(mixing empty ones causes the volume to be lowered)
	 //during test channes 1 and 2 apperas to be in 7 and 8 positions.
}

function _init_w4r12r1(command,config){
        command.inputSampleRate(22050)
         .inputEncoding('signed')
         .inputBits(16)
         .inputChannels(1)
         .inputFileType('raw');
        command.outputSampleRate(config.out.rate)
         .outputEncoding(config.out.encoding)
         .outputBits(config.out.bits)
         .outputChannels(config.out.channels)
         .outputFileType('raw');
}


AudioConverter.prototype.__proto__ = EventEmitter.EventEmitter.prototype; //inheredits EventEmitter functions

AudioConverter.prototype.write = function(buffer){
	this.inStream.emit('data',buffer);
};

AudioConverter.prototype.end = function(){
	this.inStream.emit('end');
};


module.exports = AudioConverter;
