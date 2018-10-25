var EventEmitter = require('events');
var Stream = require('stream');
var SoxCommand = require('sox-audio');

/**
 * @class
 * @classdesc Utility class for converting audio
 */
function AudioConverter(){
	var self = this;
	
	//input strams to read incomung buffers
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
	var command = SoxCommand();
	command.input(this.inStream)
  	 .inputSampleRate(16000)
  	 .inputEncoding('signed')
  	 .inputBits(16)
  	 .inputChannels(8)
  	 .inputFileType('raw');
	command.output(this.outStream)
  	 .outputSampleRate(16000)
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

	//ogging SOX error
	command.on('error', function(err, stdout, stderr) {
  		console.log('Cannot process audio: ' + err.message);
  		console.log('Sox Command Stdout: ', stdout);
		console.log('Sox Command Stderr: ', stderr)
	});
	
	//Startig SOX converter (Spawn process)
	command.run();
}

AudioConverter.prototype.__proto__ = EventEmitter.EventEmitter.prototype; //inheredits EventEmitter functions

AudioConverter.prototype.write = function(buffer){
	//console.log('Converting buffer');
	this.inStream.emit('data',buffer);
}


module.exports = AudioConverter;
