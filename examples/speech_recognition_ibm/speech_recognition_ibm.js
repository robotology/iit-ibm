
var https = require('https');
var fs = require('fs');
var express = require('express');

var yarp = require('../../yarp');


var options = {
    key: fs.readFileSync('./examples/stream_audio_https/conf/server.key'),
    cert: fs.readFileSync('./examples/stream_audio_https/conf/server.crt'),
    requestCert: false,
    rejectUnauthorized: false
};


var app = express();



app.use(express.static('js'));

app.get('/', function(req, res){
  res.sendFile('/speech_recognition_ibm.html',{ root : __dirname});
});




var server = https.createServer(options, app).listen(3000, function(){
    console.log("server started at port 3000");
});

var io = require('socket.io')(server);



var port = new yarp.Port('sound');
port.open('/receiver');


io.on('connection', function(socket){
    port.onRead(function(msg){
        socket.on('stream-audio', function (data) {
            var sound = port.prepare();
            sound.fromBinary(data.buffer);
            console.log(sound.toBinary());
            port.write();
        })
    })
});
