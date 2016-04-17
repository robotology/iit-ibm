


var yarp = (function yarp(){

    var socket = undefined;
    var _internal_port_manager = [];

    var initFunction = undefined;
    var yarpInitialized = false;

    function onInit(cb) {
        initFunction = cb;

        if(yarpInitialized)
            initFunction();
    }

    // initialize yarp witht the io socket
    function init(_socket) {

        socket = _socket;
      
        socket.on('yarp active ports', function(msg){
            _internal_port_manager = msg;
        });

        if(initFunction != undefined)
            initFunction();

        yarpInitialized = true;
    }



    function Port(){

        var port_name = undefined;
        var port_type = undefined;
        var callback = Array();

        var open = function open(_port_name,_port_type) {

            if(port_name != undefined || _internal_port_manager[_port_name] != undefined)
               return false;

            port_type = _port_type;
            if (port_type == undefined)
                port_type = 'bottle';

            console.log(port_type);

            port_name = _port_name;
            socket.emit('yarp open port',{port_name:port_name,port_type:port_type});

            _internal_port_manager[port_name] = this;

            for(var i=0; i<callback.length; i++)
                _internal_port_manager[port_name].onRead(callback[i]);            

            return true;
        }


        var close = function close() {
            if(port_name)
            {
                socket.removeAllListeners('yarp ' + port_name + ' message');
                socket.emit('yarp close port',port_name);
                port_name = undefined;
            }
        }

        var write = function write(message) {
            if(port_name)
                socket.emit('yarp ' + port_name + ' message', message);
        }

        var onRead = function onRead(cb) {
            callback.push(cb);
            socket.on('yarp ' + port_name + ' message', function(msg){cb(msg);});
        }


        var Port = {
            open: open,
            close: close,
            write: write,
            onRead: onRead
        }

        return Port;
    }


    var PortHandler = {

        openPort: function openPort(port_name,port_type) {
          if(_internal_port_manager[port_name] == undefined)
          {
            var p = new Port();
            if(!p.open(port_name,port_type))
              return undefined;
          }
          
          return _internal_port_manager[port_name];

        },

        getPort: function getPort(port_name) {
          return _internal_port_manager[port_name];
        }
    };



    //----- Speech Recognition Wrapper


    var Recognizer = new webkitSpeechRecognition();
    var _Recognizer_autorestart = false;
    Recognizer.enableAutorestart = function enableAutorestart(){_Recognizer_autorestart=true;}
    Recognizer.disableAutorestart = function disableAutorestart(){_Recognizer_autorestart=false;}


    Recognizer.lang = "en";
    Recognizer.onresult = function(event) {
        if (event.results.length > 0) {
            result = event.results[event.results.length-1];
            if(result.isFinal) {
              
                var speechEvent = new CustomEvent('yarp speech finished',{'detail':result});

                Recognizer.dispatchEvent(speechEvent);

                if(_Recognizer_autorestart)  
                    setTimeout(function(){ Recognizer.start(); }, 0);                    
            }
        }  
    };

  //-----


    // ----- Image Display Utilities


    function getImageSrc(compression_type,image_buffer)
    {
        return 'data:image/'+compression_type+';base64,' + base64ArrayBuffer(image_buffer);
    }


    function base64ArrayBuffer(arrayBuffer) 
    {
        var base64    = ''
        var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

        var bytes         = new Uint8Array(arrayBuffer)
        var byteLength    = bytes.byteLength
        var byteRemainder = byteLength % 3
        var mainLength    = byteLength - byteRemainder

        var a, b, c, d
        var chunk

        // Main loop deals with bytes in chunks of 3
        for (var i = 0; i < mainLength; i = i + 3) {
        // Combine the three bytes into a single integer
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

        // Use bitmasks to extract 6-bit segments from the triplet
        a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
        b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
        c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
        d = chunk & 63               // 63       = 2^6 - 1

        // Convert the raw binary segments to the appropriate ASCII encoding
        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
        }

        // Deal with the remaining bytes and padding
        if (byteRemainder == 1) {
        chunk = bytes[mainLength]

        a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

        // Set the 4 least significant bits to zero
        b = (chunk & 3)   << 4 // 3   = 2^2 - 1

        base64 += encodings[a] + encodings[b] + '=='
        } else if (byteRemainder == 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

        a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
        b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

        // Set the 2 least significant bits to zero
        c = (chunk & 15)    <<  2 // 15    = 2^4 - 1

        base64 += encodings[a] + encodings[b] + encodings[c] + '='
        }

        return base64
    }


    // -----



    var yarp = {
        init: init,
        onInit: onInit,
        Port: Port,
        PortHandler: PortHandler,
        Recognizer: Recognizer,
        getImageSrc: getImageSrc
    };

    return yarp;


})();




