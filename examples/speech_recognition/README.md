

# Speech Recognition and Synthesis

This application uses the Google Speech Recognition and Synthesis APIs available for Google Chrome (not Firefox yet!) to:

1. receive text messages over the YARP network and convert them to speech.
2. recognize human speech from a device and send the recognized sentence as a YARP Bottle on the YARP network. 

This is done by opening two YARP ports: `/yarpjs/speech/tts:i` and `/yarpjs/speech/rec:o` used respectively to read text in input an transform it into speech or stream out recognized human speech in textual form.

Below we describe how to use this demo application. Follow the instructions in [here](/examples) to setup the system. 

Go [here](#code-overview) for an overview of how to use yarp.js and implement this application yourself!

## Speech Synthesis

<p align='center'>
<img src="https://github.com/robotology/yarp.js/blob/master/images/example_browser_speech_recognition.png" width="60%">
</p>

You can try out speech synthesis by just filling the input box to the left of the button *Speak*. However the cool thing is to send messages from YARP, so go on a shell and open a port to write in the messages you want to speak aloud
```
$> yarp write ... /yarpjs/speech/tts:i
```
Now, every message you write in this terminal will get to your browser and will be synthesized to actual sound. Try it out!

## Speech Recognition

The YARP port `/yarpjs/speech/rec:o` opened by this script returns speech recognized using the Google Speech API as a single-string text in a YARP Bottle over the YARP Network. We can read from this as follows: go on a shell and run `yarp read ... /yarpjs/speech/rec:o`. Now we are ready for speech recognition:

Press the *Voice Recognition* button. You should receive a dialog asking for permission to use your microphone (unless you already set Chrome to have full permission to use your microphone and camera). You can then start speech recognition. Both English and Italian are available for this example:

On your shell you should be able to see the YARP Bottles rendered as strings containing the messages recognized by the Google Speech Recognition APIs.

