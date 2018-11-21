
//*
// * Copyright: (C) 2010 RobotCub Consortium
// * Authors: Paul Fitzpatrick, Francesco Nori
// * CopyPolicy: Released under the terms of the LGPLv2.1 or later, see LGPL.TXT
//*/


#include <stdio.h>
#include <iostream>
#include <cstring>
#include <yarp/dev/PolyDriver.h>
#include <yarp/dev/AudioGrabberInterfaces.h>

#include <yarp/os/Network.h>
#include <yarp/os/Port.h>



using namespace yarp::os;
using namespace yarp::sig;
using namespace yarp::dev;

int main(int argc, char *argv[]) {

    // Open the network
    Network yarp;
    BufferedPort<Sound> p;
    p.open("/receiver");

    //Network::connect("/w4r1/sound.o", "/receiver");
    // Get an audio write device.
    Property conf;
    conf.put("device","portaudio");
    conf.put("samples", "4096");
    conf.put("write", "1");
    PolyDriver poly(conf);
    IAudioRender *put;

    // Make sure we can write sound
    poly.view(put);
    if (put==NULL) {
        printf("cannot open interface\n");
        return 1;
    }

    //Receive and render
    while (true)
      {
        std::cout << "audio file" << std::endl;
        auto s = p.read();
        Sound speech;
        speech.setFrequency(16000);
        speech.resize(4096,1);
        put->renderSound(speech);


        //speech.resize(4096,1);
        //speech.setFrequency(22050);

        //if (s->size() && s->get(0).isBlob())
        //{
        //    memcpy(speech.getRawData(),s->get(0).asBlob(),263722);
        //    put->renderSound(speech);
        //}
        //else
        //std::cout << "non c'è niente" << std::endl;
      }

    return 0;
}



