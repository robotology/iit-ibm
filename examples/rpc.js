

var yarp = require('./yarp');

var net = new yarp.Network();

var port = new yarp.BufferedPort('bottle');


port.onRead(function(msg){
    console.log(msg.toString());
});


port.onRPC(function(msg){
    console.log(msg.toString());


    var b = new yarp.Bottle();
    b.fromString('This is the answer (to Everything!): ' + msg.toString());

    port.reply(b);
});



port.open('/mimmo');


