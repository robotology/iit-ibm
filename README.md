# YarpJS
A JavaScript set of bindings for YARP


## Installation

Before using YarpJS you will need to install:
* [YARP](https://github.com/robotology/yarp) (Duh!). With OpenCV!
* [Node.js](https://nodejs.org/en/)

Then go to the folder where you have cloned this repository and run:
```
$> npm install
$> cmake-js
```

**Note**: Depending on how you installed Node.js you could be required to run `$> sudo npm install`


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

#### Writing on a Port

Let's write something from our port!
```js
var bottle = new yarp.Bottle();
bottle.fromString('This is a Bottle');

port.write(bottle);
```
So, if someone is listening to our port (e.g. run in a different shell `$> yarp read ... /yarpjs/example`), she will receive a YARP Bottle containing the string `'This is a Bottle'`. **Note**: you can create more complex YARP Bottles with the standard YARP sintax (e.g. `bottle.fromString('(This is) (a Bottle)')` creates a bottle with two bottles inside, containing respectively the strings `'This is'` and `'a Bottle'`.

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


