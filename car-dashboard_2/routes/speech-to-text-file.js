
var yarp = require('../../yarp');
var ibm_sound_port_receiver = new yarp.Port('sound');
ibm_sound_port_receiver.open('/ibmjs/sound:i');

var ibm_speech_to_text_sender = new yarp.Port('bottle');
ibm_speech_to_text_sender.open('/ibmjs/speech_to_text:o');

var sample_rate = 16000;
var bit_depth = 16;
var num_samples=32000;
var channel = 1;
var acquisition_period=3;
var i = 0;
var init=false;
var stop = false;
var uint8 = new Uint8Array(num_samples*acquisition_period);
var Max=0;


let wav = require('node-wav');
var fs = require('fs');

/*
var fs = require('fs');

let buffer = fs.readFileSync('file.wav');
let result = wav.decode(buffer);
console.log(result.sampleRate);
console.log(result.channelData); // array of Float32Arrays
*/


const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');

const SpeechToText = new SpeechToTextV1({
  username: 'e0ea3a19-20a9-4c87-a7e6-34a45ee8447e',
  password: 'IQ6y6CU1DNAI',
  version: '2018-02-16'
});

//var Msg=[];

// Sound from user
ibm_sound_port_receiver.onRead(function(msg){

    for(var j = 0; j < num_samples*i; j++)
    {uint8.set([msg.toSend().content[j]],j)}
    Max=getMaxOfArray(uint8);
    if(Max!=0)
    {
        //console.log(uint8);
        fs.writeFile("giuliaProva2.wav", getData(uint8, sample_rate), function(err) {
        if(err) {
            return console.log(err);
        }
            console.log("The file was saved!");
        });

        //console.log('file_content',file_content);

    }
    else
    {
        console.log('Sono in ascolto !');
    }
    i++;
});



//0
//function SpeechRecognition(Msg,Msg_length)
//{
//    wav.encode(Msg, { sampleRate: sample_rate, float: false, bitDepth: bit_depth, channels: channel, samples: Msg_length });
//    //wav.encode(result.channelData, { sampleRate: result.sampleRate, float: true, bitDepth: 32 });
//    //audio = SpeechToText.recognizeFile(stream);
//}


function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}


var u32ToArray = function(i)
{
    return [i&0xFF, (i>>8)&0xFF, (i>>16)&0xFF, (i>>24)&0xFF];
};

var u16ToArray = function(i)
{
    return [i&0xFF, (i>>8)&0xFF];
};


function getData(buffer, sampleRate, bitsPerSample = 16) {
    var data = buffer;
    var sampleRate = sampleRate;

    var header = {                            // OFFS SIZE NOTES
        chunkId      : [0x52,0x49,0x46,0x46], // 0    4    "RIFF" = 0x52494646
        chunkSize    : 0,                     // 4    4    36+SubChunk2Size = 4+(8+SubChunk1Size)+(8+SubChunk2Size)
        format       : [0x57,0x41,0x56,0x45], // 8    4    "WAVE" = 0x57415645
        subChunk1Id  : [0x66,0x6d,0x74,0x20], // 12   4    "fmt " = 0x666d7420
        subChunk1Size: 16,                    // 16   4    16 for PCM
        audioFormat  : 1,                     // 20   2    PCM = 1
        numChannels  : 1,                     // 22   2    Mono = 1, Stereo = 2...
        sampleRate   : sampleRate,            // 24   4    8000, 44100...
        byteRate     : 0,                     // 28   4    SampleRate*NumChannels*BitsPerSample/8
        blockAlign   : 0,                     // 32   2    NumChannels*BitsPerSample/8
        bitsPerSample: bitsPerSample,         // 34   2    8 bits = 8, 16 bits = 16
        subChunk2Id  : [0x64,0x61,0x74,0x61], // 36   4    "data" = 0x64617461
        subChunk2Size: 0                      // 40   4    data size = NumSamples*NumChannels*BitsPerSample/8
    };

    header.blockAlign = (header.numChannels * header.bitsPerSample)/8;
    header.byteRate = header.blockAlign * header.sampleRate;
    header.subChunk2Size = data.byteLength;
    header.chunkSize = 36 + header.subChunk2Size;

    var headernew = new Uint8Array(44);
    headernew.set(header.chunkId, 0);
    headernew.set(u32ToArray(header.chunkSize), 4);
    headernew.set(header.format, 8);
    headernew.set(header.subChunk1Id, 12);
    headernew.set(u32ToArray(header.subChunk1Size), 16);
    headernew.set(u16ToArray(header.audioFormat), 20);
    headernew.set(u16ToArray(header.numChannels), 22);
    headernew.set(u32ToArray(header.sampleRate), 24);
    headernew.set(u32ToArray(header.byteRate), 28);
    headernew.set(u16ToArray(header.blockAlign), 32);
    headernew.set(u16ToArray(header.bitsPerSample), 34);
    headernew.set(header.subChunk2Id, 36);
    headernew.set(u32ToArray(header.subChunk2Size), 40);
    return [].concat(
        headernew,
        data
    );
}





/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
const watson = require('watson-developer-cloud');

const authorizationService = new watson.AuthorizationV1({
  username: process.env.SPEECH_TO_TEXT_USERNAME || 'e0ea3a19-20a9-4c87-a7e6-34a45ee8447e',
  password: process.env.SPEECH_TO_TEXT_PASSWORD || 'IQ6y6CU1DNAI',
  url: watson.SpeechToTextV1.URL
});



// Inform user that TTS is not configured properly or at all
if (!(process.env.SPEECH_TO_TEXT_USERNAME && process.env.SPEECH_TO_TEXT_PASSWORD)) {
  // eslint-disable-next-line
  console.warn('WARNING: The app has not been configured with a SPEECH_TO_TEXT_USERNAME and/or ' +
    'a SPEECH_TO_TEXT_PASSWORD environment variable. If you wish to have text to speech ' +
    'in your working application, please refer to the https://github.com/watson-developer-cloud/car-dashboard ' +
    'README documentation on how to set these variables.');
}


module.exports = function initSpeechToText(app) {
  app.get('/api/speech-to-text/token', (req, res) =>
    authorizationService.getToken(function (err, token) {
      if (err) {
        console.log('error:', err);
        console.log('Please refer to the https://github.com/watson-developer-cloud/car-dashboard\n' +
          'README documentation on how to set username and password variables.');
      } else {
        res.send(token);
      }
    })
  );
};
*/
