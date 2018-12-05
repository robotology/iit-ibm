
/////////////////////////////////////////////////////
///////////// W4R1 Sound Receiver ///////////////////
/////////////////////////////////////////////////////


#include <unistd.h>
#include <stdio.h>
#include <iostream>
#include <string>
#include <fstream>
#include <signal.h>

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

int r1listen = 0;

void sig1(int sig){
	fprintf(stderr,"LISTENINGGGG");
	r1listen = 1;
}
void sig2(int sig){
	fprintf(stderr,"NOT LISTENINGGGG");
	r1listen = 0;
}


int main(int argc, char *argv[]) {

	signal(SIGUSR1, sig1);
	signal(SIGUSR2, sig2);

	fprintf(stderr,"*** STARTING RECEIVER ***");

	//Open the network

    	Network yarp;
fprintf(stderr,"1");

	BufferedPort<Sound> soundPortIn;
fprintf(stderr,"2");
	soundPortIn.setStrict(true);
fprintf(stderr,"3");
	soundPortIn.open("/w4r1/sound.i");
fprintf(stderr,"4");
	Sound * sound;
int n =0;
	while(true){
		sound = soundPortIn.read(true);
		if (sound && sound > 0){
fprintf(stderr,"received: %d size: %lu",n,sound->getRawDataSize());n++;
            //yDebug() << "RECEIVER, sound received: " << sound->getRawDataSize() << "=>" << sound->getRawData()[0] ;
			//<< "RECEIVER, sound received: " << sound->getRawDataSize() << "=>" << sound->getRawData()[0] ;
if(r1listen>0){
 fprintf(stderr,"writing");
			write (1, sound->getRawData(),sound->getRawDataSize());
}
else fprintf(stderr,"dropping");
		}
	}


	//END CODE
	return 0;
}
