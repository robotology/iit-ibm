

# Tutorials

We have prepared a series of tutorials on how to use yarp.js. In this section you will find the instruction to write and run a minimalistic node server that uses yarp.js. You can then try these applications by following the links below:

* [Speech Recognition and Synthesis](https://github.com/robotology/yarp.js/blob/master/examples/speech_recognition)
* [Visualization with WebGL - Point Cloud](https://github.com/robotology/yarp.js/blob/master/examples/point_cloud) 
* [Transmitting Inertial Data](https://github.com/robotology/yarp.js/blob/master/examples/inertial_data)
* [Stream Audio](https://github.com/robotology/yarp.js/blob/master/examples/stream_audio)
* [Stream Video (a yarpview with yarp.js)](https://github.com/robotology/yarp.js/blob/master/examples/stream_video) 
* [Secure Domains (HTTPS)](#secure-domains)

**Note.** Due to some recent changes in Google Chrome's privacy settings, applications that require to access the device camera/microphone need to run from an `https` domain (rather than `http`). Go to [Secure Domains (HTTPS)](#secure-domains) for instruction on how to run the same applications with a self-signed SSL certificate. These applications should run fine on Firefox. 


<a name='setup'></a>
## Setup

Throughout, we will assume that a YARP server is running. If that's not your case, run `$> yarp server` on a shell on any computer on the network where the yarp.js server will run. 

Then, from the folder where you cloned yarp.js, run the examples script
```
$> node examples/examples.js
```
This 
open the browser on any device connected to your network and go to the address
```
your.machine.ip.address:3000 
// or simply localhost:3000 if you are on the same machine where you run the examples script.
```
(You can get your device ip by typing `$> ifconfig` on a shell on the machine where the examples is running). You should see a webpage like the one below

<p align='center'>
<img style='border:1px solid green; box-shadow: 0 0 10px rgba(0,0,0, .65);' src="https://github.com/robotology/yarp.js/blob/master/images/example_browser_landing.png" width="60%">
</p>

The available examples will be shown in the header.

## Server

The script examples.js is a minimal example of node server running yarp.js. It starts by `require`ing the necessary dependencies to run a HTTP server and get some basic functionalities (e.g. websockets), namely
```
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
```
and loading the yarp.js c++ wrapper of YARP.  
```
var yarp = require('../yarp');
```
In order to handle yarp.js browser-server communication, we created a wrapper for the `io` object in yarp that manages already things for you. We setup this by
```

```


Then we set up the static folders that will be made accessible to the client. These will simply contain static data (e.g. .html fils, images, etc.). For more info on serving data to clients the server consult the [express.js](https://expressjs.com/) library. Finally we set up the default page to serve whenever a client connects 
```
app.get('/', function(req, res){
  res.sendFile('index.html',{ root : __dirname});
});
```
We can finally start the server
```
http.listen(3000, function(){
  console.log('listening on *:3000');
});
```
and we are ready to go! (of course you can change the port on which the server runs).


<a name='secure-domains'></a>
## Secure Domains (HTTPS)

Recently, Google Chrome has changed its privacy settings, requiring applications that access the device microphone or camera to run from a secure origin (HTTPS). We have provided a self-signed certificate to run local applications from an HTTPS domain rather than HTTP, therefore circumventing this issue. **However we have not yet determined whether the HTTPS will introduce latencies in data transmission between yarp.js browser and server**

To start the "secure" yarp.js server, simply run
```
node examples/examples_https.js
```
then go to
```
https://your.machine.ip.address:3000  // <--- mind the https at the beginning!!
```
you should get a warning, telling you something similar to "your connection is not private". Click on the link `Advanced` and then `Proceed to (address)`. You should now be able to see the usual starting page of yarp.js examples. But you are now running on HTTPS!!



