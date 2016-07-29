

# yarp.js
A JavaScript set of bindings for YARP.

* [Introduction](#introduction)
* [Installation](#installation)
* [Examples](#examples)
    - [Speech Recognition and Synthesis](#example-speech-recognition-and-synthesis)
    - [Visualization with WebGL](#example-visualization-with-WebGL)
* [Server](#server)
    - [Port Communication](#port-communication)
        - [Reading](#port-reading)
        - [Writing](#port-writing)
        - [RPC](#port-rpc)
* [Client (Browser)](#browser)
    - [Server Setup](#browser-server-setup)
    - [Browser Setup](#browser-client-setup)
    - [Port Communication](#browser-port-communication)
        - [Open/Close](#browser-open-close)
        - [Read/Write](#browser-read-write)
        - [Handling Connections](#browser-handling-connections)


<a name='introduction'></a>
## Introduction

This library has been developed with the idea of bringing YARP to any device without heavy code dependencies (It just needs an Internet Browser!). The idea is to have a server in charge of directly interacting with the YARP C++ layer (and the rest of the YARP network) while clients are completely implementation and hardware independent. Indeed, code is shipped by the server to all clients via [websockets](https://en.wikipedia.org/wiki/WebSocket?oldformat=true) (in particular the [Socket.io](http://socket.io/) Node module), **without the need to install anything on the client machine** (a part the Browser of course).

<p align='center'>
<img src="https://github.com/robotology/yarp.js/blob/master/images/yarp.js_Network.png" width="60%">
</p>

The library is based on node.js which can be natively integrated with external C++ code via [Node addons](https://nodejs.org/api/addons.html).

**Tested OS:** yarp.js has been tested on **OSX** and **Ubuntu**. This goes for the server side. The client side goes on any machine with a version of Google Chrome installed. 


<a name='installation'></a>
## Installation

**Server dependencies**: 
* [YARP](https://github.com/robotology/yarp) (Duh!). With OpenCV!
* [node.js](https://nodejs.org/en/). Version >= 4.2.2
* [Cmake.js](https://www.npmjs.com/package/cmake-js)

**Note**: 
- **Please make sure** that your Node version is >= 4.2.2
- **Linux** If you installed Node.js from the package manager, it could happen that the command `node` is not in your path, but rather `nodejs` is. To this end, run `$> sudo ln -s /usr/bin/nodejs /usr/bin/node`.
- To install cmake-js, run `$> sudo npm install -g cmake-js`.


**Client dependencies (on any device on your network)**: 
* [Google Chrome](https://www.google.com/chrome/)

Once you have all dependencies installed, go to the folder where you have cloned this repository and run:
```
$> npm install
$> cmake-js
```

**Note**: Depending on how you installed Node.js you could be required to run `$> sudo npm install`


<a name='examples'></a>
## Examples

Let us start with some example to see what can be done with yarp.js:

<a name='example-speech-recognition-and-synthesis'></a>
### Easy-peasy Speech Recognition and Synthesis

This example uses the Google Speech Recognition and Synthesis APIs available for Google Chrome to:
1. receive messages over the YARP network and speak them aloud from any device.
2. recognize human speech from a device and send the recognized sentence as a YARP Bottle on the YARP network. 

We will assume that a YARP server is running. If that's not your case, run `$> yarp server` on a shell. Then, from the folder where you cloned yarp.js, run 
```
$> node examples/speech_rec_example.js
```
Then, open [Google Chrome](https://www.google.com/chrome/) on a device on your network and go to the address
```
your.machine.ip.address:3000
```
(You can get your ip by typing `$> ifconfig` on a shell on the machine where node is running). You should see a webpage like the one below

<img src="https://github.com/robotology/yarp.js/blob/master/images/speech_permission.png" width="40%">

The script `examples/speech_rec_example.js` creates two YARP ports: `/web/speak:i` and `/web/speechRec:o`. Let's see how to use them.


#### Speech Synthesis

You can try out speech synthesis by just filling the input box to the left of the button *Speak*. However the cool thing is to send messages from YARP, so go on a shell and open a port to write in the messages you want to speak aloud
```
$> yarp write ... /web/speak:i
```
Now, every message you write in this terminal will get to your browser and will be synthesized to actual sound. Try it out!

#### Speech Recognition

The YARP port `/web/speechRec:o` opened by this script returns speech recognized using the Google Speech API as a single-string text in a YARP Bottle over the YARP Network. We can read from this as follows: go on a shell and run `yarp read ... /web/speechRec:o`. Now we are ready for speech recognition:

Press the *Voice Recognition* button. You should receive (unless you already set Chrome to have full permission to use your microphone and camera) a dialog asking for permission to use your microphone (see the screenshot below, captured from an Android smartphone):

<img src="https://github.com/robotology/yarp.js/blob/master/images/speech_permission.png" width="40%">

You can then start speech recognition. Both English and Italian are available for this example:

<img src="https://github.com/robotology/yarp.js/blob/master/images/speech_en.png" width="40%">
<img src="https://github.com/robotology/yarp.js/blob/master/images/speech_it.png" width="40%">

On your shell you should be able to see the YARP Bottles rendered as strings containing the messages recognized by the Google Speech Recognition APIs.

<a name='example-visualization-with-WebGL'></a>
### Visualization with WebGL (and Three.js)



In this demo we will see how information sent on the YARP network can be visualized on the browser using different tools. In particular we will use [Google Charts](https://developers.google.com/chart/) and [Three.js](https://github.com/mrdoob/three.js/) (a wrapper for [WebGL](https://en.wikipedia.org/wiki/WebGL?oldformat=true)) to visualize the current orientation of a device streaming data over YARP.

In particular we will have a smartphone sending a 3 dimensional vector containing the device orientation through the YARP network. Then we will have another device reading from the network the device orientation and visualizing it on screen.

Demo suggested by [Pattacini](https://github.com/pattacini) in issue [#3](https://github.com/robotology/yarp.js/issues/3). Result of the demo:

<p align='center'>
<img src="https://github.com/robotology/yarp.js/blob/master/images/visualize-data.gif" width="60%">
</p>

##### The Server

From the folder where you cloned this repository run `$> node examples/send_inertial_data.js`. This will start a server on the port `:3000`. 

##### The Device

On your device (e.g. smartphone, tablet, etc.) open Chrome and go to `your.machine.ip.address:3000`. You should see your device orientation printed on screen.

##### The Client

On your client (any machine) open Chrome and go to `your.machine.ip.address:3000/receive`. You should see a Google Line Chart dynamically plotting your device orientation. You should also see a window with a mockup smartphone whose orientation changes according to the device streaming on the network.



<a name='server'></a>
## Server

<a name='port-communication'></a>
### Port Communication

Ports are a key component to YARP. In this section we are going to see how yarp.js allows us to use YARP ports from JavaScript (in a Node environment).

Throughout we will assume that a **yarp server** is running on our network (if it's not your case, just run `$> yarp server` in a shell). You can find the example described in this section in the script `examples/port_basics.js`.

From the folder where you have cloned this repository run `$> node` to enter in the interactive Node.js interface. Then run:
```js
var yarp = require('./yarp');
var ynet = new yarp.Network();
```
The first command loads the yarp.js module that will allow us to use YARP from JS. The second command is necessary to register the current session on the YARP network. We can finally create and open a port:
```js
var port = new yarp.BufferedPort('bottle');
port.open('/yarpjs/example');
```
You should receive a message from YARP saying something like: `yarp: Port /yarpjs/example active at tcp://some.ip:address` At the time being yarp.js can open buffered ports for YARP `bottle`s and `image`s.

<a name='port-writing'></a>
#### Writing on a Port

Let's write something from our port!
```js
var bottle = new yarp.Bottle();
bottle.fromString('This is a Bottle');

port.write(bottle);
```
So, if someone is listening to our port (e.g. run in a different shell `$> yarp read ... /yarpjs/example`), she will receive a YARP Bottle containing the string `'This is a Bottle'`. **Note**: you can create more complex YARP Bottles with the standard YARP sintax (e.g. `bottle.fromString('(This is) (a Bottle)')` creates a bottle with two bottles inside, containing respectively the strings `'This is'` and `'a Bottle'`.



<a name='port-reading'></a>
#### Reading from a Port

Let's set up the callback for when a message is sent from another port to `/yarpjs/example`:
```js
port.onRead(function(msg){
    console.log('Message received: ' + msg.toString());
});
```
This way, whenever a message arrives, it is printed on screen. You can try it out by going on another bash and type:
```
$> yarp write ... /yarpjs/example
>> Hello yarp.js!
```
On the shell where you run yarp.js you should be able to see the message: `Message received: Hello "yarp.js!"`

**Note**: The `onRead` method of a yarp port takes in input a callback. Everytime the port reads something on the network the callback is called with that objects as message `msg`.

<a name='port-rpc'></a>
#### RPC Communication

You can also set the RPC behavior for your port. For instance
```js
port.onRPC(function(msg){
    console.log(msg.toString());

    var bottle = new yarp.Bottle();
    bottle.fromString('Reply (' + msg.toString() + ')');

    port.reply(bottle);
});
```
You can try this behavior by running in another shell `$> yarp rpc /yarpjs/example` and then typing a message. You should receive a reply `Reply (<your message>)`.**Note**: the `onRPC` callback behave exactly like the `onRead`. Howevere it assumes that the method `reply` will be eventuallycalled. As a good practice we suggest to always put the `reply` command inside the `onRPC` callback. 


<a name='browser'></a>
## Client (Browser)

This section describes how a yarp.js server communicates with the browser. **This section is in alpha and it is likely to be subject to changes**

**Note** yarp.js uses the websocket library [Socket.io](http://socket.io/) to exchange messages between server and the browser. However, the node.js wrapper and the browser communication are completely decoupled, so you can implement your own communication protocol.

<a name='browser-server-setup'></a>
### Setup for the Server


To setup the server side create a js file for your server, e.g. `server.js`. The minimal code to run the server is 

```js
// Basic required node plugins to start the http server and socket.io
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// yarp.js
var yarp = require('../yarp');  // <-- the path to yarp.js in the folder where you cloned this repo.
yarp.browserCommunicator(io);   // <-- The service handling communication with the browser.

// The Express.js routing to your index file (change it to your desired homepage, e.g. index.html)
app.get('/', function(req, res){
  res.sendFile('index.html',{ root : __dirname});
});

/*
    Your code here
*/

// Run the server on locahlhost:3000
http.listen(3000, function(){
  console.log('listening on *:3000');
});
```

This is enough to have a yarp.js server up and running and ready to communicate with the browser.

Note that we use [Express.js](http://expressjs.com/), since it is used by Socket.io. 


<a name='browser-client-setup'></a>
### Setup for the Browser

To use yarp.js on your browser simply include the following library in your html file (e.g. index.html)
```html
<script src="/socket.io/socket.io.js"></script>
<script src="/yarp.js"></script>
```
Then, within a script tag 
```js
var socket = io();  // for socket io
yarp.init(socket); // to initialize the yarp.js wrapper with socket.io
```

**Note.** In order to start working with ports, yarp.js needs to be initialized with socket io. This means that all the code related to yarp.js (e.g. opening/closing ports, writing from ports or set up `onRead` callbacks **must**  be included in

```js
yarp.onInit(function() {

    // open ports
    // onRead callbacks

}
```



<a name='browser-port-communication'></a>
### Port Communication

A browser cannot directly open a yarp port, but has to ask the server to open one. Therefore, in a nutshell, the communication between the YARP network and a browser works as follows: Suppose the server has a port open, let's say `/myport`. The Browser asks the server (via websockets) to registers to that port. If the port does not exist the server opens one for the browser. From that moment on, any message read from `/myport` is forwarded (via websockets) to the browser. The same works the other way around for the browsers to send messages on a YARP port.

<a name='browser-open-close'></a>
#### Opening/Closing Ports

To register the browser to a YARP port
```js
var port = new Port();
port.open(port_name,port_type); // port_type default: 'bottle'
```
If the port does not exist, the server opens one. Note that `port.open` returns a bool (`true` if the port was opened `false` otherwise). If the browser has already a port opened with that name, it does not open a new one and returns `false`.

You can close the port with `port.close()`, however note that since multiple clients could be connected to the same server.  
<a name='browser-read-write'></a>
#### Reading/Writing

Reading from a port is analogous to server side: you can pass a callback function that is invoked whenever a yarp port is read (on the server) to the port we are registered to. For instance
```js
port.onRead(function(message){console.log(message);});
```

Writing is analogous: `port.write(message)`. For instance if you want to send a vector (automatically transformed to a YARP Bottle over the nework):
```js
port.write([1,2,3]);
```
<a name='browser-handling-connections'></a>
#### Handling Connections

You can also (ask the server to) connect YARP ports with
```js
yarp.Network.connect('/writing/port:o','/reading/port:i');
```
and disconnect them with `yarp.Network.disconnect('/writing/port:o','/reading/port:i');`
