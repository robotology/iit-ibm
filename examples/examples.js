// examples.js

// require and setup basic http functionalities
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


// require yarp.js and setup the communication
//with the browser using websockets
var yarp = require('../yarp');

yarp.browserCommunicator(io);

// setup static folders 
app.use(express.static('node_modules'));
app.use(express.static('js'));
app.use(express.static('examples'));

// setup default page
app.get('/', function(req, res){
  res.sendFile('index.html',{ root : __dirname});
});

// start the server!
http.listen(3000, function(){
  console.log('listening on *:3000');
});





