


#ifndef YARP_JS_BOTTLE_H
#define YARP_JS_BOTTLE_H


#include <nan.h>
#include <string>

#include "YarpJS_Wrapper.h"
#include <yarp/os/Bottle.h>


class YarpJS_Bottle: public YarpJS_Wrapper<yarp::os::Bottle>
{
private:
    static void setJSMethods(v8::Local<v8::FunctionTemplate> &tpl)
    {
        Nan::SetPrototypeMethod(tpl, "copy", Copy);
        Nan::SetPrototypeMethod(tpl, "toArray", ToArray);
        Nan::SetPrototypeMethod(tpl, "toString", ToString);
        Nan::SetPrototypeMethod(tpl, "toObject", ToArray);
        Nan::SetPrototypeMethod(tpl, "fromString", FromString);
        Nan::SetPrototypeMethod(tpl, "getObjType", GetObjType);
    }

public:


    void fromString(const Nan::FunctionCallbackInfo<v8::Value> &info)
    {
        v8::String::Utf8Value _bottle_string(info[0]->ToString());
        this->getYarpObj()->fromString(*_bottle_string);
    }

    static v8::Local<v8::Array>& toArray(const yarp::os::Bottle *bObj);


    explicit YarpJS_Bottle(const Nan::FunctionCallbackInfo<v8::Value> &info)
    {
        this->setYarpObj(new yarp::os::Bottle());
        this->fromString(info);
    }


    explicit YarpJS_Bottle(yarp::os::Bottle &bottle)
    {
        this->setYarpObj(new yarp::os::Bottle(bottle));
    }


    ~YarpJS_Bottle()
    {}

    static NAN_METHOD(Copy);
    static NAN_METHOD(ToArray);
    static NAN_METHOD(ToString);
    static NAN_METHOD(FromString);
    static NAN_METHOD(GetObjType);




    // NAN Stuff
    YARPJS_INIT(YarpJS_Bottle,"Bottle",YarpJS)
};






#endif


