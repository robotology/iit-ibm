
/////////////////////////////////////////////////////
///////////// R1 CLIENT FOR W4R1 ////////////////////
/////////////////////////////////////////////////////

/*
 * Copyright: (C) 2010 RobotCub Consortium 
 * Authors: Paul Fitzpatrick, Francesco Nori
 * CopyPolicy: Released under the terms of the LGPLv2.1 or later, see LGPL.TXT
 */

#include <stdio.h>
#include <iostream>
//#include <string>
//#include <fstream>
#include<pthread.h>
//#include <thread>

#include <yarp/os/Port.h>
#include <yarp/os/Network.h>
#include <yarp/dev/AudioGrabberInterfaces.h>
#include <yarp/dev/PolyDriver.h>
//#include <yarp/os/Property.h>
//#include <yarp/os/Time.h>
//#include <yarp/os/TypedReaderCallback.h>
//#include <yarp/sig/SoundFile.h>
#include <yarp/os/LogStream.h>
//#include </home/gdangelo/workspace/yarp/example/portaudio/onread.h>
#include "rapidjson/document.h"
using namespace rapidjson;
// ...
//using namespace std;
using namespace yarp::os;
using namespace yarp::sig;
using namespace yarp::dev;

const char* NOTIFY = "notify";
const char* ACTION = "action";
const char* ACTION_PARAMS = "acrion_params";
const char* NOTIFY_LISTEN = "listen";
const char* NOTIFY_SILENCE = "silence";

/*** THREADS ***/
void* SoundReceiverThread(void* args)   {
	BufferedPort<Sound> soundPortIn;
	soundPortIn.open("/r1/sound.i");

        if(!Network::connect("/w4r1/sound.o","/r1/sound.i")){
            return 0;
        }
	
	while(true){
		auto s_speech_out = soundPortIn.read();
		if (s_speech_out){
                        yDebug() << "SOUND RECEIVED";
		}
	}
}

/** END TRHEADS **/
char* unescape(const char* s,char quote){ //removse each second occurence of quote
        char *unescapedS = new char[strlen(s)*sizeof(char)];
        int i, j;
        for(i = j = 0; i < (strlen(s)); i++){
                unescapedS[j]=s[i];
                if(s[i] == quote){

                        if(s[i+1]==quote) {i++; }
                }
                j++;
        }
        return unescapedS;
}

void startMic(){
	yDebug() << "start mic";
}
void stopMic(){
	yDebug() << "stop mic";
}


int executeAction(const char* action, rapidjson::Value& params, char** result){
	//switch action ...
	yDebug() << "Performing action" << action;
	*result = NULL;
	return 0;
}

int executeAction(const char* action, char** result){
	yDebug() << "Performing action (1)" << action;
	return 0;
}

int processCommand(const char* command,char** answer){
	char * c = unescape(command,'"');
	int  out = 0;
	yDebug() << "Processing cmd" << command << "=>" << c;
	Document document;
	document.Parse(c);

	//yDebug() << "is obk" << document.IsObject();
	if(document.HasMember(NOTIFY)){
		const char* notify = document[NOTIFY].GetString();
		yDebug() << NOTIFY << notify;
		if(strcmp(notify, NOTIFY_LISTEN)==0){
			startMic();
		} else
		if(strcmp(notify, NOTIFY_SILENCE)==0){
			stopMic();
		}
	}

	if(document.HasMember(ACTION)){
		const char* action = document[ACTION].GetString();
		 yDebug() << ACTION << action;
		//int status = -1;
		if(document.HasMember(ACTION_PARAMS)){
			 rapidjson::Value& params = document[ACTION_PARAMS];
			out = executeAction(action,params,answer);		
		}else 
			out = executeAction(action,answer);		
	}
	return out;
	
}

/*
pthread_mutex_t mutex;

pthread_mutex_lock(&mutex);
flag=1;
pthread_mutex_unlock (&mutex);
*/

int main(int argc, char *argv[]) {
	yDebug() << "*** STARTING R1 Client for W4R1. ***";

	// Open the network
    	Network yarp;

    	// Open ports
    	Port cmdPortOut;
    	cmdPortOut.open("/r1/cmd.o");
    	Port cmdPortIn;
    	cmdPortIn.open("/r1/cmd.i");

	Network::connect("/r1/cmd.o","/w4r1/cmd.i");
    	Network::connect("/w4r1/cmd.o","/r1/cmd.i");
    	//Network::connect("/r1/sound.o","/w4r1/sound.i","tcp");
    	//Network::connect("/w4r1/sound.o","/r1/sound.i");
   

	//SOUND THREAD
	yDebug() << "Starting Sound Listener";
	pthread_t soundReceiverThread;
	void* status;

	pthread_create(&soundReceiverThread, NULL, SoundReceiverThread, NULL);
  	//pthread_join (soundReceiverThread, &status);
	

/*

    //SENDER Get speech and send.
    // Set parameters
    Property conf_sender;
    int rec_seconds = 1;
    int channels=1;
    int rate= 2048;

    // Get a portaudio read device.
    conf_sender.put("device","portaudio");
    conf_sender.put("read", "");
    conf_sender.put("samples", rate*rec_seconds);
    conf_sender.put("rate", rate);
    conf_sender.put("channels", channels);
    PolyDriver poly_sender(conf_sender);
    IAudioGrabberSound *get_sender;

    poly_sender.view(get_sender);
    if (get_sender==NULL)
    {
        printf("cannot open interface\n");
        return 1;
    }


    //RECEIVER Get an audio write device.
    Property conf_receiver;
    conf_receiver.put("device","portaudio");
    conf_receiver.put("samples", "4096");
    conf_receiver.put("write", "1");
    PolyDriver poly_receiver(conf_receiver);
    IAudioRender *put_receiver;

    // Make sure we can write sound
    poly_receiver.view(put_receiver);
    if (put_receiver==NULL)
    {
        printf("cannot open interface\n");
        return 1;
    }

    //Grab and send
    Sound s_speech_in;
    double tTOT=0;
    //Receive and render
    Sound *s_speech_out;

*/




	
	bool shutdown = false;

	//MAIN LOOP holding several conversations	
	yDebug() << "Entering main loop.";
	while(!shutdown){

	
		//TODO wait here for converstation start
		//Send start convesation
		yDebug() << "New Conversation";
		Bottle msg;
    		msg.addString("{ \"status\":\"conv_start\" }");
		cmdPortOut.write(msg);


		//cmd handler (it could be another theread runnging)
    		while(true) {
        		yarp::os::Time::delay(0.1);
			Bottle cmd;
			cmdPortIn.read(cmd);
        		std::string cmd_input = cmd.get(0).asString();
        		std::cout << "CMD IN: "<< cmd_input << std::endl;
			char* answer = NULL;
			processCommand(cmd_input.c_str(),&answer);
			if(answer) {
				Bottle bottleAnswer;
    				bottleAnswer.addString(answer);
				cmdPortOut.write(bottleAnswer);
			}
    		}
 /*   while(true)
    {

	//SENDER
        if(cmd_input =="record")
        {
            get_sender->startRecording();

            double t1=yarp::os::Time::now();
            get_sender->getSound(s_speech_in);
            double t2=yarp::os::Time::now();
            tTOT = tTOT+(t2-t1);

            soundPortOut.write(s_speech_in);
            std::cout << "Uint8(0) " << (int) s_speech_in.getRawData()[0] << std::endl;

            std::cout << "Sending Speech Sound"<< std::endl;
            std::cout << "getChannel " << (int) s_speech_in.getChannels() << std::endl;

        }
        else if (cmd_input ==" stop recording")
        {
            Bottle msg_stop_record;
            msg_stop_record.addString("stop recording");
            cmdPortOut.write(msg_stop_record);

            get_sender->stopRecording();
        }


        //RECEIVER
        if(cmd_input =="speech")
        {
            //s_speech_out = soundPortIn.read(false);
            //if (s_speech_out!=NULL)
            //{
                put_receiver->renderSound(*s_speech_out);
            //}
        }
        else if (cmd_input =="stop_speaking") //aggiungere lo stop speaking
        {
            Bottle msg_speech;
            msg_speech.addString("stop speech");
            cmdPortOut.write(msg_speech);
        }
        yarp::os::Time::delay(0.01);
*/
   // th.join();

	}//END MAIN LOOP
   
	pthread_join (soundReceiverThread, &status);
	
	return 0;
}
