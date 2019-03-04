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
TextToSpeechService.prototype.synthesize =

	//VERSION FOR OLD USERNAME AND PASSWORD CREDENTIALS
	 function(text,res,download) {
	
		var synthesizeParams = {
				  text: text,
				  accept: 'audio/wav',
				  voice: 'it-IT_FrancescaVoice',
				  donwload : download
				};
	  const _download = synthesizeParams.donwload;
	  const transcript = textToSpeech.synthesize(synthesizeParams);
	  transcript.on('response', (response) => {
	    if (_download){
	      response.headers['content-disposition'] = `attachment; filename=transcript.${getFileExtension(synthesizeParams.accept)}`;
	    }
	  });
	  transcript.on('error', function(error){
		  res.status = 500;
		  return res;
	  });
	  transcript.pipe(res);
	};




/* //API KEY VERSION OVER HTTP
TextToSpeechService.prototype.stream = function(text,outputStream,errorCalback) {
	var synthesizeParams = {
		  text: text,
		  accept: 'audio/wav',
		  voice: 'it-IT_FrancescaVoice',
		  donwload : false
		};

textToSpeech.synthesize(synthesizeParams, (err, res) => {
  if (err) {
   console.log("TTS Error",error);
	errorCalback(error);
  } else {
console.log("RESSS",res);
    outputStream.write(res); // or whatever you want to do with the stream
outputStream.end();
  }
});

};
*/

//APY KEY VERSION OVER WEBSOCKET
TextToSpeechService.prototype.stream = function(text,outputStream,errorCalback) {
	var synthesizeParams = {
		  text: text,
		  accept: 'audio/wav',
		  voice: 'it-IT_FrancescaVoice',
		  donwload : false
		};


 	const transcript = textToSpeech.synthesizeUsingWebSocket(synthesizeParams);

	  transcript.on('error', function(error){
		console.log("TTS Error",error);
		errorCalback(error);
	  });
	  transcript.pipe(outputStream);  
		//TODO Change to avoid closing output stream
		//TODO add a end treanscription callback or event.
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
