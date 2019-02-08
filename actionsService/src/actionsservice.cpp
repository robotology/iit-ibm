
/////////////////////////////////////////////////////
///////////// R1 CLIENT FOR W4R1 ////////////////////
/////////////////////////////////////////////////////

/*
 * Copyright: (C) 2010 RobotCub Consortium
 * Authors: Paul Fitzpatrick, Francesco Nori
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
	yDebug() << "Processing action: " <<  inMsg.get(0).asString();
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

