# YarpJS
A JavaScript set of bindings for YARP.

* [Introdution](#introduction)
* [Installation](#installation)
* [Examples](#examples)
* [Port Communication](#port-communication)
    - [Reading](#port-reading)
    - [Writing](#port-writing)
    - [RPC](#port-rpc)



<a name='introduction'></a>
## Introduction

This library has been developed with the idea of bringing YARP to any device without heavy code dependencies (It just needs an Internet Browser!). The idea is to have a server in charge of directly interacting with the YARP C++ layer (and the rest of the YARP network) while clients are completely implementation and hardware independent. Indeed, code is shipped by the server to all clients, which therefore do not need to install anything (a parte from the Browser).

The library is based on Node.js, which is implemented in C++ and has a natural way to interact with external C++ code via [Node addons](https://nodejs.org/api/addons.html).


<a name='installation'></a>
## Installation

Server dependencies: 
* [YARP](https://github.com/robotology/yarp) (Duh!). With OpenCV!
* [Node.js](https://nodejs.org/en/)

Client dependencies (on any device on your network): 
* [Google Chrome](https://www.google.com/chrome/)

Once you have all dependencies installed, go to the folder where you have cloned this repository and run:
```
$> npm install
$> cmake-js
```

**Note**: Depending on how you installed Node.js you could be required to run `$> sudo npm install`


<a name='examples'></a>
## Examples

Let us start with some example to see what can be done with YarpJS:

#### Easy-peasy speech recognition

This example uses the Google Speech Recognition API available on Google Chrome to recognize human speech from a device and send the recognized sentence as a YARP Bottle on the YARP network. 

If you don't have a YARP server running, run `$> yarp server` on a shell. Then, from the folder where you cloned YarpJS, run
```
$> node examples/speech_rec_example.js
```
Then, open [Google Chrome](https://www.google.com/chrome/) on a device on your network and go to the address
```
your.machine.ip.address:3000
```
(You can get your ip by typing `$> ifconfig` on a shell on the machine where node is running).

You should see something like this, askinf for permission to use your microphone (screenshot from an Android device):

<img src="https://github.com/cciliber/YarpJS/blob/master/images/speech_permission.png" width="40%">

You can then start speech recognition, both english and italian are available:

<img src="https://github.com/cciliber/YarpJS/blob/master/images/speech_en.png" width="40%">
<img src="https://github.com/cciliber/YarpJS/blob/master/images/speech_it.png" width="40%">


**Note**: the script `examples/speech_rec_example.js` creates a YARP port `/web/speech` that returns the speech text recognized using the Google Speech API. We can read from that (e.g. `yarp read ... /web/speech`) and obtain the text as a single-string Yarp Bottle.


<a name='port-communication'></a>
## Port Communication

Ports are everything in YARP, so let's start with that. Throughout we will assume that a **yarp server** is running on our network (if you don't just run `$> yarp server` in another shell).

From the folder where you have cloned this repository run `$> node` to enter in the interactive Node.js interface. Then run:
```js
var yarp = require('./yarp');
var ynet = new yarp.Network();
```
The first command loads the YarpJS module that will allow us to use YARP from JS. The second command is necessary to register the current session on the YARP network. We can finally create and open a port:
```js
var port = new yarp.BufferedPort('bottle');
port.open('/yarpjs/example');
```
You should receive a message from YARP saying something like: `yarp: Port /yarpjs/example active at tcp://some.ip:address` At the time being YarpJS can open buffered ports for YARP `bottle`s and `image`s.

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
    console.log('Message received:' + msg.toString());
});
```
This way, whenever the port reads something, it prints on screen what it has read. You can try it out by going on another bash and type:
```
$> yarp write ... /yarpjs/example
>> Hello YarpJS!
```
On the shell where you run YarpJS you should be able to see the message: `Message received: Hello "YarpJS!"`

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


