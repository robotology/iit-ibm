var yarp = require('../yarp.js/yarp');
var fs = require('fs');
var sleep = require('system-sleep');

'use strict'

 //sound_receiver_port;
// cmd_receiver_port;

function R1()//w4r1)
{
    this.w4r1; // = w4r1;
    this.mic = false;

    this.sound_receiver_port = new yarp.Port('sound');
    this.sound_receiver_port.open('/watsonR1/sound:i');

    this.cmd_receiver_port = new yarp.Port('bottle');
    this.cmd_receiver_port.open('/watsonR1/text:i');

};

R1.prototype.setMic=function(mic_status){
    this.mic = mic_status;
};

R1.prototype.setW4r1=function(w4r1){
    const w =w4r1;
    this.w4r1 = w4r1;

    this.sound_receiver_port.onRead(function(msg)
    {

        var buffer=msg.toSend().content;
        console.log('Yarp port: ',buffer);
        //console.log('letti: ',buffer.length);


        // IF MIC IS ON
        w.sendAudio(buffer);
        //console.log(buffer);


    });

    this.cmd_receiver_port.onRead(function(msg)
    {
        var msg=msg.toString();
        var cmd = getCommand(msg);
        switch (cmd)
        {
            case 'HOT_WORD':
                w.notifyHotWord();
                break;
            default:
            break;
        }
    });
};


R1.prototype.speak=function(audio){

};

/**
 * @param bahaviour JSON ...
 */
R1.prototype.behave=function(bahaviour){}


function getCommand(msg){
    return msg;
};



module.exports = R1;
