

#ifndef YARPJS_CALLBACKABLE_H
#define YARPJS_CALLBACKABLE_H


#include <nan.h>

#include <yarp/os/Mutex.h>
#include "YarpJS.h"


#include <stdio.h>
#include <string>
#include <vector>



class YarpJS_Callbackable {
private:
    Nan::Callback                                           *callback;
    uv_work_t                                               work_req;

    static void _internal_worker(uv_work_t *req);
    static void _internal_worker_end(uv_work_t *req, int status);

protected:
    yarp::os::Mutex                                 mutex_callback;
    

public:

    void _callCallback();
    void _setCallback(const Nan::FunctionCallbackInfo<v8::Value> &info);


    virtual void prepareCallback(std::vector<v8::Local<v8::Value> > &tmp_arguments) = 0;


    explicit YarpJS_Callbackable()
    {    
        this->work_req.data = this;
        callback = NULL;
    }


    ~YarpJS_Callbackable()
    {
        uv_cancel((uv_req_t*) &this->work_req);
        mutex_callback.unlock();

        if(callback!=NULL)
            delete callback;
    }

};



#endif


