
var AssistantService = require('./AssistantService');
var TextToSpeechService = require('./TextToSpeechService');
var Cedat85SpeechToTextService = require('./Cedat85STTServiceFile');
var R1 = require('./R1');

var sample_rate=16000;

function W4R1(r1){

    sttvar= new Cedat85SpeechToTextService();
    this.tts = new TextToSpeechService();
    this.assistant = new AssistantService();
    this.r1 = r1;
    this.stt = sttvar;
}

var sttvar;

W4R1.prototype.sendAudio=function(buffer)
{
    //converts buffer from uint16 to int16
    convertAudio(buffer);

};


W4R1.prototype.notifyHotWord=function(){

};

var sox = require('sox-stream');
var Stream = require('stream');
var converter = sox({input: {encoding:'unsigned'},output:{encoding:'signed', type: 'wav'}});
converter.on('data',function(chunk){sttvar.sendAudio(chunk);});
var src = new Stream();
src.readable = true;

var dest = new Stream();
dest.writable = true;

src.pipe(converter).pipe(dest);

var convertAudio = function(buff)
{
    src.emit('data',buff);


};



module.exports = W4R1;
