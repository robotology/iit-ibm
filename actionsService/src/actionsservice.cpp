
/////////////////////////////////////////////////////
///////////// R1 CLIENT FOR W4R1 ////////////////////
/////////////////////////////////////////////////////

/*
 * Copyright: (C) 2010 RobotCub Consortium
 * Authors: Giulia D'Angelo, Alessandro Faraotti
 * CopyPolicy: Released under the terms of the LGPLv2.1 or later, see LGPL.TXT
 */

#include <unistd.h>
#include <stdio.h>
#include <iostream>
#include <string.h>
#include <fstream>
#include<pthread.h>
#include <thread>

#include <yarp/os/Port.h>
#include <yarp/os/Network.h>
#include <yarp/dev/AudioGrabberInterfaces.h>
#include <yarp/dev/PolyDriver.h>

#include <yarp/os/Property.h>
#include <yarp/os/Time.h>
#include <yarp/os/TypedReaderCallback.h>
#include <yarp/sig/SoundFile.h>
#include <yarp/os/all.h>
#include <yarp/os/LogStream.h>

using namespace yarp::os;
using namespace yarp::sig;
using namespace yarp::dev;


//CONSTANTS SHARED WITH R1 CLIENT
const char* DIRECTIONS ="directions";
const char* MOVE = "move";
const char* FACE_COLOR = "color";

const char* RESULT_DONE = "done";
const char* RESULT_ERROR = "error";

const char* PORT_ACTION_IN = "/behaviour/actions.i";
const char* PORT_ACTION_OUT = "/behaviour/actions.o";


/*****************************/
/*** R1 Specific Behaviour ***/
/*****************************/

const char* move(char* place){
	yDebug() << "Moving to " << place;
	yarp::os::Time::delay(2.0);
	return RESULT_DONE;
}

const char* provideDirections(char* place){
	yDebug() << "Giving Directions to " << place;
	yarp::os::Time::delay(2.0);
	return RESULT_DONE;
}

const char* highlightPath(char* color){
	yDebug() << "Highlighting path color "<< color;
	yarp::os::Time::delay(2.0);

	return RESULT_DONE;
}


/*****************************/



Bottle process(Bottle inMsg){

	char* action = NULL;
	char** params = NULL;


	std::string stra =  inMsg.get(0).asString();
	action = new char[stra.length() + 1];
	strcpy(action, stra.c_str());

	yDebug() << "Processing action: " <<  action;

	//pick paramteters
	size_t size = inMsg.size();
	yDebug() << "Parameters found: " <<  size;
	if(size>1) params = new char*[size-1];
	for(int i=1; i<size; i++){

		std::string str =  inMsg.get(i).asString();
		char *cstr = new char[str.length() + 1];
		strcpy(cstr, str.c_str());

		params[i-1] = cstr;
		yDebug() << params[i-1];
	}

	
	//IN THIS VERSION WILL BE USED
        //action 
	//params[1] (if not available a default value may be used or and error returned)
        //eg. action = directions; params[1] = bar;
	//eg. action = highlight; params[1] = red;
	//eg. action = move; params[1] = room_123


	yarp::os::Time::delay(2.0);
	const char* result = RESULT_DONE;  	
	Bottle bottle;
    	bottle.addString(result);
	return bottle;
}



int main(int argc, char* argv[]) {

    yDebug() << "*** Starting ACTION Service for R1 Client. ***";

    char name[30] = "/ctpservice/right_arm/rpc";

    // Open the network
    Network yarp;

    // Open rpc port arm movement
    RpcServer port;
    port.open(name);

    // Open Bottle ports 
    Port portOut;
    portOut.open(PORT_ACTION_OUT);

    // Open Bottle ports 
    Port portIn;
    portIn.open(PORT_ACTION_IN);

    while(true){
	//
	yarp::os::Time::delay(0.1);
	//
	Bottle inBottle,outBottle;
	portIn.read(inBottle); //showuld be blocking
	outBottle = process(inBottle);
	portOut.write(outBottle);
   }

    return 0;
}

