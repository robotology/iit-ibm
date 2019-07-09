
/////////////////////////////////////////////////////
///////////// W4R1 Sound Receiver ///////////////////
/////////////////////////////////////////////////////


#include <unistd.h>
#include <stdio.h>
#include <iostream>
#include <string>
#include <fstream>
#include <csignal>

#include <yarp/os/Port.h>
#include <yarp/os/Network.h>
#include <yarp/dev/AudioGrabberInterfaces.h>
#include <yarp/dev/PolyDriver.h>

#include <yarp/os/Property.h>
#include <yarp/os/Time.h>
#include <yarp/os/TypedReaderCallback.h>
#include <yarp/sig/Sound.h>
#include <yarp/sig/SoundFile.h>
#include <functional>

#include <yarp/os/LogStream.h>
#include <vector>
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

	std::signal(SIGUSR1, sig1);
	std::signal(SIGUSR2, sig2);

	fprintf(stderr,"*** STARTING RECEIVER ***");

	//Open the network

    	Network yarp;

	BufferedPort<Sound> soundPortIn;
	soundPortIn.setStrict(true);
	soundPortIn.open("/w4r1/sound.i");
	Sound * sound;
        int n =0;
	while(true)
        {
        sound = soundPortIn.read(false);
        if (sound && sound > 0)
        {
#if DEBUG_PRINT
            yError(">>>>>>received: %d, size: %lu samples, %d channels",n,sound->getSamples(), sound->getChannels());
#endif
            n++;
            if(r1listen>0)
            {
#if DEBUG_PRINT
                yError(">>>>>>writing");
#endif
                auto sss = sound->getInterleavedAudioRawData();
                size_t size_sss = sss.size()*2; //short to char
                auto data_vec = std::vector<short>(sss.begin(), sss.end());
                unsigned char* sss_uc= (unsigned char*)(data_vec.data());
                write (1, sss_uc,size_sss);
            }
            else
            {
                fprintf(stderr,"dropping");
            }
        }
        yarp::os::Time::delay(0.005);
    }


	//END CODE
	return 0;
}
