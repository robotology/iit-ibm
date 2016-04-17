

var yarp = require('./yarp');

var net = new yarp.Network();

var port = new yarp.BufferedPort('bottle');


port.open('/yarpjs/example');


port.onRead(function(msg){
    console.log('Message received: ' + msg.toString());
});


port.onRead(function(msg){
    console.log(msg.toString());
});





port.onRPC(function(msg){
    console.log(msg.toString());

    var bottle = new yarp.Bottle();
    bottle.fromString('Reply (' + msg.toString() + ')');

    port.reply(bottle);
});




