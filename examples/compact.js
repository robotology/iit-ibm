// hello.js

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


var yarp = require('../yarp');

var net = new yarp.Network();


app.get('/', function(req, res){
  res.sendfile('examples/compact.html');
});

app.get('/YarpJS.js', function(req, res){
  res.sendfile('js/YarpJS.js');
});

app.get('/jquery.js', function(req, res){
  res.sendfile('/node_modules/jquery/jquery.js');
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});


yarp.browserCommunicator(io);



