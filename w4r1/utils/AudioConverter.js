var EventEmitter = require('events');
var Stream = require('stream');
var SoxCommand = require('sox-audio');

/**
 * @class
 * @classdesc Utility class for converting audio
 */
function AudioConverter(config){

	var self = this;
	
	//input strams to read incoming buffers
        this.inStream = new Stream();
        this.inStream.readable = true;

	//output stream waiting for converted bufffers
	this.outStream = new Stream();
	this.outStream.writable = true;
	this.outStream.write = function(chunk){
 		//emitting 'data' event upon conversion
        	console.log("Converted chunk: ",chunk.length,chunk);
		self.emit('data',chunk);
	}

	//SOX conversoin settings
	this.command = SoxCommand();
	this.command.input(this.inStream);
	this.command.output(this.outStream);

	if(config == "r12w4r1")
		_init_r12w4r1(this.command);
	else {
		if(config == "w4r12r1")
		_init_w4r12r1(this.command);
	}
	
	//logging SOX error
	this.command.on('error', function(err, stdout, stderr) {
  		console.log('Cannot process audio: ' + err.message);
  		console.log('Sox Command Stdout: ', stdout);
		console.log('Sox Command Stderr: ', stderr)
	});
	
	//Startig SOX converter (Spawn process)
	this.command.run();
}

function _init_r12w4r1(command){
	command.inputSampleRate(16000)
  	 .inputEncoding('signed')
  	 .inputBits(16)
  	 .inputChannels(8)
  	 .inputFileType('raw');
  	command.outputSampleRate(16000)
  	 .outputEncoding('signed')
  	 .outputBits(16)
 	  // .outputChannels(1)
  	 .outputFileType('wav');
	 command.addEffect('remix','7,8'); 
	 //NOTE:
	 //selects usefull audio channells
	 //selecting only meaningufull channels
	 //(mixing empy ones causes the volume to be lowered)
	 //during test channes 1 and 2 apperas in position 7 end 8. 
}

function _init_w4r12r1(command){
        command.inputSampleRate(16000)
         .inputEncoding('signed')
         .inputBits(16)
         .inputChannels(1)
         .inputFileType('raw');
        command.outputSampleRate(16000)
         .outputEncoding('signed')
         .outputBits(16)
          // .outputChannels(1)
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
	//console.log('Converting buffer');
	this.inStream.emit('data',buffer);
}


module.exports = AudioConverter;
