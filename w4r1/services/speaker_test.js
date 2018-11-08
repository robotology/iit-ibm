/**
 * Copyright 2018 IBM Corp. All Rights Reserved.
 *
 */

 'use strict';

//var Yarp= require('../yarp.js/yarp');
var Yarp = require('YarpJS');
var speaker_test_sound = new Yarp.Port('sound');
var fs = require('fs');
var sleep = require('system-sleep');

//var audio_file = './resources/01_stt_raw_wav.wav';
var audio_file = './resources/test.wav';

function Speaker(){


    speaker_test_sound.open('/speaker_test.o');
    speaker_test_sound.setStrict(true);

    //connecting
    Yarp.Network.connect('/speaker_test.o','/receiver');
    // TESTS FUNCTIONS //

    speaker_test();

}

function speaker_test() {
    console.log("speaker test");
    var n=0;
    var readStream = fs.createReadStream(audio_file,{ highWaterMark: 4 * 1024 });
          readStream.on('data', function (chunk) {
                 //console.log("R1 sending: ",n,chunk.length,chunk);
                 console.log("speaker test: ",n,chunk.length);
                 n++;
                 sleep(5); //sleeps a bit to simulate real speach rate
                 speaker_test_sound.write(chunk); //ToBinary porta con se l'informazione dell'header
          });
 }

module.exports = Speaker;
