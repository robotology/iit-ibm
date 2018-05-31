var draw = function() {

    if(streamer!=undefined)
    {
      // you can then access all the frequency and volume data
      // and use it to draw whatever you like on your canvas
      for(bin = 0; bin < streamer.length; bin ++) {
          // do something with each value. Here's a simple example
          var val = streamer[bin];
          var red = val+100;
          var green = 149 - val;
          var blue = 237 + val / 2;
          canvasContext.fillStyle = 'rgb(' + Math.round(red) + ', ' + Math.round(green) + ', ' + Math.round(blue) + ')';
          var bin_size = 3;
          canvasContext.fillRect(bin * bin_size, 0, bin_size, 200);
          // use lines and shapes to draw to the canvas is various ways. Use your imagination!
      }

    }
    requestAnimationFrame(draw);
};
////

function success(e) {
  audioContext = window.AudioContext || window.webkitAudioContext;
  context = new audioContext();

  // the sample rate is in context.sampleRate
  audioInput = context.createMediaStreamSource(e);

  var bufferSize = 2048;
  recorder = context.createScriptProcessor(bufferSize, 1, 1);


  // for visualizaiton
  analyser = context.createAnalyser();
  analyser.fftSize = 256; // see - there is that 'fft' thing.
  audioInput.connect(analyser);
  // analyser.connect(context.destination);

  var sampleAudioStream = function() {

    if(recording)
      analyser.getByteFrequencyData(streamer);
    else
    {
      for(bin = 0; bin < streamer.length; bin ++)
        streamer[bin]=0;
    }

  };
  setInterval(sampleAudioStream, 20); //
  // public properties and methods
  streamer = new Uint8Array(128); // This just means we will have 128 "bins" (always half the
  recorder.onaudioprocess = function onaudioprocess(e2) {

    if(!recording)
    {
      return;
    }
    var left = e2.inputBuffer.getChannelData(0);
    var hh = convertFloat32ToInt16(left);

    // socket.emit('stream-audio',{buffer:hh});
    port_mic_out.write(hh);
  }
  audioInput.connect(recorder);
  recorder.connect(context.destination);
}

////
function convertFloat32ToInt16(buffer) {
  l = buffer.length;
  buf = new Int16Array(l);
  while (l--) {
    buf[l] = Math.min(1, buffer[l])*0x7FFF;
  }
  return buf.buffer;
}



function toggleVoiceBTN(el)
{
  if($(el).hasClass('btn-primary'))
  {
    recording=false;
    $(el).removeClass('btn-primary');
    $(el).find('i').removeClass('fa-microphone');
    $(el).find('i').addClass('fa-microphone-slash');
  }
  else
  {
    recording=true;
    $(el).addClass('btn-primary');
    $(el).find('i').removeClass('fa-microphone-slash');
    $(el).find('i').addClass('fa-microphone');
  }
}
