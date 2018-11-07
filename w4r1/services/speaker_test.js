/**
 * Copyright 2018 IBM Corp. All Rights Reserved.
 *
 */

 'use strict';

//var Yarp= require('../yarp.js/yarp');
var Yarp = require('YarpJS');
var fs = require('fs');


function Speaker(){

    speaker_test_sound = new Yarp.Port('sound');
    speaker_test_sound.open('/speaker_test.o');

    //connecting
    Yarp.Network.connect('/speaker_test.o','/receiver');
    // TESTS FUNCTIONS //

    speaker_test = function() {
	       console.log("speaker test");
           var n =0;
	       var readStream = fs.createReadStream('./resources/01_stt_raw_wav.wav',{ highWaterMark: 4 * 1024 });
		         readStream.on('data', function (chunk) {
				     //console.log("R1 sending: ",n,chunk.length,chunk);
				     console.log("speaker test: ",n,chunk.length);
				     n++;
				     sleep(5); //sleeps a bit to simulate real speach rate
                     speaker_test_sound.write(chunk); //ToBinary porta con se l'informazione dell'header
			});
    }
}

module.exports = Speaker;
