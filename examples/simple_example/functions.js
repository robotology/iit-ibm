function toggleVoiceBTN(el)
{
  if($(el).hasClass('btn-primary'))
  {
    yarp.Recognizer.stop();
    $(el).removeClass('btn-primary');
    $(el).find('i').removeClass('fa-microphone');
    $(el).find('i').addClass('fa-microphone-slash');
  }
  else
  {
    yarp.Recognizer.start();
    $(el).addClass('btn-primary');
    $(el).find('i').removeClass('fa-microphone-slash');
    $(el).find('i').addClass('fa-microphone');
  }
}


function speakAndWrite(msg)
{
  yarp.Synthetizer.speak(msg);
  $('#messages').append('<li><samp class="reply-from-server">$> Synthetized: '+msg+'</samp></li>');
}

function speakBTN()
{
  var msg = $('#speak-message-text').val();
  speakAndWrite(msg);
}

function toggleLanguageIT()
{
  yarp.Recognizer.setLang('it');
  yarp.Synthetizer.setLang('it');
}

function toggleLanguageEN()
{
  yarp.Recognizer.setLang('en');
  yarp.Synthetizer.setLang('en');
}

$("#form-speech-synthesis").submit(function(e){
  e.preventDefault();
  speakBTN();
});
