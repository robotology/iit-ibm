

#ifndef YARPJS_BUFFERED_PORT_BOTTLE_JS_H
#define YARPJS_BUFFERED_PORT_BOTTLE_JS_H


#include <nan.h>

#include <yarp/os/BufferedPort.h>
#include <yarp/os/Bottle.h>

#include "YarpJS_BufferedPort.h"

#include <stdio.h>
#include <string>


class YarpJS_BufferedPort_Bottle :  public YarpJS_BufferedPort<yarp::os::Bottle> 
{

private:

    static void setJSMethods(v8::Local<v8::FunctionTemplate> &tpl)
    {
        Nan::SetPrototypeMethod(tpl,"open",Open);
        Nan::SetPrototypeMethod(tpl,"close",Close);
        Nan::SetPrototypeMethod(tpl,"onRead",SetOnReadCallback);
        Nan::SetPrototypeMethod(tpl,"write",Write);
        Nan::SetPrototypeMethod(tpl,"prepare",Prepare);

    }
    
    std::string                         port_name;


public:



    virtual void prepareCallback(std::vector<v8::Local<v8::Value> > &tmp_arguments);

    explicit YarpJS_BufferedPort_Bottle(const Nan::FunctionCallbackInfo<v8::Value> &info)
    {}

    explicit YarpJS_BufferedPort_Bottle()
    {}


    ~YarpJS_BufferedPort_Bottle()
    {}


    // NAN Stuff
    static NAN_METHOD(Open);
    static NAN_METHOD(Close);
    static NAN_METHOD(SetOnReadCallback);
    static NAN_METHOD(Write);
    static NAN_METHOD(Prepare);

    YARPJS_INIT(YarpJS_BufferedPort_Bottle,"BufferedPortBottle",YarpJS)
};



#endif


