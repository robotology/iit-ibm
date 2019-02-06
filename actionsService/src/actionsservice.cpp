
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

char INDICA_word[10]="INDICA";
char COLORA_word[10]="COLORA";
char CAMMINA_word[10]="CAMMINA";
char HOT_WORD[10];

int main(int argc, char* argv[]) {

    yDebug() << "*** STARTING R1 Client for W4R1. ***";

    char name[30] = "/ctpservice/right_arm/rpc";

    // Open the network
    Network yarp;

    // Open rpc port arm movement
    RpcServer port;
    port.open(name);

    // Open Bottle ports 
    Port cmdPortOut;
    cmdPortOut.open("/r1/actions.o");

    // Open Bottle ports 
    Port cmdPortIn;
    cmdPortIn.open("/r1/actions.i");

    while(true){
/*
        HOT_WORD=cmdPortIn.read();

	if (strcmp( HOT_WORD, INDICA_word));
	else if (strcmp( HOT_WORD, COLORA_word))
	else if (strcmp( HOT_WORD, CAMMINA_word))
        else
*/ 
   }


    return 0;
}
