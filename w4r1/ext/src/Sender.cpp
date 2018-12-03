
/////////////////////////////////////////////////////
///////////// W4R1 Sound Sender  ////////////////////
/////////////////////////////////////////////////////


#include <unistd.h>
#include <stdio.h>
#include <iostream>
#include <string>
#include <fstream>

#include <yarp/os/Port.h>
#include <yarp/os/Network.h>
#include <yarp/dev/AudioGrabberInterfaces.h>
#include <yarp/dev/PolyDriver.h>

#include <yarp/os/Property.h>
#include <yarp/os/Time.h>
#include <yarp/os/TypedReaderCallback.h>
#include <yarp/sig/SoundFile.h>

#include <yarp/os/LogStream.h>
using namespace yarp::os;
using namespace yarp::sig;
using namespace yarp::dev;
using namespace std;


int main(int argc, char *argv[]) {
	yError() << "*** STARTING SENDER ***";

	//Open the network
	Network network;

	Port soundPortOut;
    	soundPortOut.open("/w4r1/sound.o");

    	Sound s;
//    get->startRecording(); //this is optional, the first get->getsound() will do this anyway.


    int n=0;
    const int maxbuff = 16000*2*8;
    char* buff = new char[maxbuff];
	int nread = 0;
    while (true)
    {
	nread = cin.readsome(buff,maxbuff);
	
        yError() << "SENDER sending" << nread;
	if(nread>0){
	yError()  <<" > "<< (char)buff[0];
	cout << buff;
	}
	// double t1=yarp::os::Time::now();
        //yarp::os::Time::delay(0.90);
        
	//READ SOUNG FROM STANDARD IN
	
	
//	get->getSound(s);
   //    yDebug() << "SENDER sending" << (int) s.getRawDataSize() << ">" <<(int) s.getRawData()[0] << std::endl;
	
	//get->getSound(s);
  //      soundPortOut.write(s);
        n++;
    }



	//END CODE
	return 0;
}
