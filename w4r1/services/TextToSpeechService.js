/**
 * 
 */

const TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');

let textToSpeech;

function TextToSpeechService(){
	
if (process.env.TEXT_TO_SPEECH_IAM_APIKEY && process.env.TEXT_TO_SPEECH_IAM_APIKEY !== '') {
	  textToSpeech = new TextToSpeechV1({
	    url: process.env.TEXT_TO_SPEECH_IAM_URL || '<url>',
	    iam_apikey: process.env.TEXT_TO_SPEECH_IAM_APIKEY || '<iam_apikey>',
	    iam_url: 'https://iam.bluemix.net/identity/token',
	  });
	} else {
	  textToSpeech = new TextToSpeechV1({
	    username: process.env.TEXT_TO_SPEECH_USERNAME || '<username>',
	    password: process.env.TEXT_TO_SPEECH_PASSWORD || '<password>',
	  });
	}

}

/**
 * Pipe the synthesize method
 */
TextToSpeechService.prototype.synthesize = function(text,res) {
	
	var synthesizeParams = {
			  text: text,
			  accept: 'audio/wav',
			  voice: 'it-IT_FrancescaVoice',
			  donwload : false
			};
  const download = synthesizeParams.donwload;
  const transcript = textToSpeech.synthesize(synthesizeParams);
  transcript.on('response', (response) => {
    if (download){
      response.headers['content-disposition'] = `attachment; filename=transcript.${getFileExtension(synthesizeParams.accept)}`;
    }
  });
  transcript.on('error', function(error){
	  res.status = 500;
	  return res;
  });
  transcript.pipe(res);
};



const getFileExtension = (acceptQuery) => {
	  const accept = acceptQuery || '';
	  switch (accept) {
	    case 'audio/ogg;codecs=opus':
	    case 'audio/ogg;codecs=vorbis':
	      return 'ogg';
	    case 'audio/wav':
	      return 'wav';
	    case 'audio/mpeg':
	      return 'mpeg';
	    case 'audio/webm':
	      return 'webm';
	    case 'audio/flac':
	      return 'flac';
	    default:
	      return 'mp3';
	  }
	};

	
	module.exports = 	TextToSpeechService;