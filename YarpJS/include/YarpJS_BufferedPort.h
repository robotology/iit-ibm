

#ifndef YARPJS_BUFFERED_PORT_JS_H
#define YARPJS_BUFFERED_PORT_JS_H


#include <nan.h>

#include <yarp/os/BufferedPort.h>
#include "YarpJS_Callbackable.h"

#include <stdio.h>
#include <string>




template<class T>
class YarpJS_BufferedPort : public YarpJS,
                            public YarpJS_Callbackable,
                            public yarp::os::BufferedPort<T>
{
protected:
   T        datum;

    virtual void onRead(T &_datum)
    {
        datum = _datum;
        this->_callCallback();
    }

public:


    explicit YarpJS_BufferedPort()
    {
        this->useCallback();
    }

    explicit YarpJS_BufferedPort(const Nan::FunctionCallbackInfo<v8::Value> &info)
    {    
        this->useCallback();
    }


    ~YarpJS_BufferedPort()
    {
        this->interrupt();
        this->close();
    }


};



#endif


