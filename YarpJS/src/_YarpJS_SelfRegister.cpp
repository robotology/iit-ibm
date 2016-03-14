

#include "YarpJS.h"
// #include "Yp2.h"

#include "YarpJS_Bottle.h"
#include "YarpJS_Image.h"
#include "YarpJS_Network.h"
// #include "YarpJS_Callbackable.h"
// #include "YarpJS_BufferedPort.h"
#include "YarpJS_BufferedPort_Bottle.h"
#include "YarpJS_BufferedPort_Image.h"


// #include "YarpJS_BufferedPort_Img.h"
// #include "YarpJS_BufferedPort_Bottle.h"



NAN_MODULE_INIT(InitAll) {
    YarpJS::Init(target);

    YarpJS_Bottle::Init(target);
    YarpJS_Image::Init(target);
    YarpJS_Network::Init(target);
    YarpJS_BufferedPort_Bottle::Init(target);
    YarpJS_BufferedPort_Image::Init(target);


}

NODE_MODULE(yarp, InitAll)
