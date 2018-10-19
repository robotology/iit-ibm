

#ifndef YARPJS_BUFFERED_PORT_IMAGE_JS_H
#define YARPJS_BUFFERED_PORT_IMAGE_JS_H


#include <nan.h>

#include <yarp/os/BufferedPort.h>
#include <yarp/sig/Image.h>

#include "YarpJS_BufferedPort_Bottle.h"
#include "YarpJS_Image.h"

#include <stdio.h>
#include <string>


class YarpJS_BufferedPort_Image :  public YarpJS_BufferedPort<yarp::sig::Image> 
{

private:

    int compression_type;

    static void setJSMethods(v8::Local<v8::FunctionTemplate> &tpl)
    {
        Nan::SetPrototypeMethod(tpl,"open",Open);
        Nan::SetPrototypeMethod(tpl,"close",Close);
        Nan::SetPrototypeMethod(tpl,"onRead",SetOnReadCallback);
        Nan::SetPrototypeMethod(tpl,"write",Write);
        Nan::SetPrototypeMethod(tpl,"prepare",Prepare);
        
        // Nan::SetPrototypeMethod(tpl,"onRPC",SetOnRPCCallback);
        // Nan::SetPrototypeMethod(tpl,"reply",Reply);

    }
    
    std::string                         port_name;


public:

    virtual void _callback_onRead(std::vector<v8::Local<v8::Value> > &tmp_arguments);

    explicit YarpJS_BufferedPort_Image(const Nan::FunctionCallbackInfo<v8::Value> &info)
    {
        compression_type = DEFAULT_COMPRESSION;
    }

    explicit YarpJS_BufferedPort_Image()
    {}


    ~YarpJS_BufferedPort_Image()
    {}


    // NAN Stuff
    static NAN_METHOD(Open);
    static NAN_METHOD(Close);
    static NAN_METHOD(SetOnReadCallback);
    static NAN_METHOD(Write);
    static NAN_METHOD(Prepare);

    // static NAN_METHOD(SetOnRPCCallback);
    // static NAN_METHOD(Reply);


    YARPJS_INIT(YarpJS_BufferedPort_Image,"BufferedPortImage",YarpJS)
};



#endif


