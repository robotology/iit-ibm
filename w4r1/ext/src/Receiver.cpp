
/////////////////////////////////////////////////////
///////////// W4R1 Sound Receiver ///////////////////
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
	yError() << "*** STARTING RECEIVER ***";

	//Open the network

    	Network yarp;
	BufferedPort<Sound> soundPortIn;
	
	soundPortIn.open("/w4r1/sound.i");

	Sound * sound;
	while(true){
		sound = soundPortIn.read(true);
		if (sound){
            		//yDebug() << "RECEIVER, sound received: " << sound->getRawDataSize() << "=>" << sound->getRawData()[0] ;
			write (1, sound->getRawData(),sound->getRawDataSize());
		}
	}


	//END CODE
	return 0;
}
