// hello.js

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var yarp = require('../yarp');
// var yarp = require('./yarp');



app.use(express.static('node_modules/three'));
app.use(express.static('js'));
app.use(express.static('examples'));
app.use(express.static('images'));


// app.get('/', function(req, res){
//   res.sendfile('examples/examples.html');
// });


app.get('/', function(req, res){
  res.sendFile('examples.html',{ root : __dirname});
});


app.get('/yarp.js', function(req, res){
  res.sendfile('/yarp.js',{ root : __dirname});
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});


yarp.browserCommunicator(io);



