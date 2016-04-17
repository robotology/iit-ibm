

#ifndef YARPJS_CALLBACK_H
#define YARPJS_CALLBACK_H


#include <nan.h>

#include <yarp/os/Mutex.h>
#include "YarpJS.h"


#include <stdio.h>
#include <string>
#include <vector>



template <class T>
class YarpJS_Callback {
private:

    typedef void (T::*PrepareCallback)(std::vector<v8::Local<v8::Value> > &tmp_arguments);

    T                                                       *parent;
    PrepareCallback                                         prepareCallback;

    Nan::Callback                                           *callback;
    uv_work_t                                               work_req;

    static void _internal_worker(uv_work_t *req);
    static void _internal_worker_end(uv_work_t *req, int status);

protected:
    yarp::os::Mutex                                 mutex_callback;
    

public:

    void callCallback();

    void setCallback(const Nan::FunctionCallbackInfo<v8::Value> &info);


    explicit YarpJS_Callback(T *_parent, PrepareCallback _prepareCallback)
        :parent(_parent), prepareCallback(_prepareCallback)

    {    
        this->work_req.data = this;
        callback = NULL;
    }


    ~YarpJS_Callback()
    {
        uv_cancel((uv_req_t*) &this->work_req);
        mutex_callback.unlock();

        if(callback!=NULL)
            delete callback;
    }

};





template <class T>
void YarpJS_Callback<T>::_internal_worker(uv_work_t *req)
{
  
}

template <class T>
void YarpJS_Callback<T>::_internal_worker_end(uv_work_t *req, int status)
{
    if (status == UV_ECANCELED)
      return;

    YarpJS_Callback<T> *tmp_this = static_cast<YarpJS_Callback<T> *>(req->data);

    Nan::HandleScope scope;

    std::vector<v8::Local<v8::Value> > tmp_arguments;
    
    // tmp_this->prepareCallback(tmp_arguments);
    (tmp_this->parent->*(tmp_this->prepareCallback))(tmp_arguments);
    
    tmp_this->callback->Call(tmp_arguments.size(),tmp_arguments.data());

    tmp_this->mutex_callback.unlock();
}


template <class T>
void YarpJS_Callback<T>::callCallback()
{
    mutex_callback.lock();

    if(callback!=NULL)        
        uv_queue_work(uv_default_loop(),&this->work_req,YarpJS_Callback::_internal_worker,YarpJS_Callback::_internal_worker_end);
    else
        mutex_callback.unlock();
}



template <class T>
void YarpJS_Callback<T>::setCallback(const Nan::FunctionCallbackInfo<v8::Value> &info)
{
    mutex_callback.lock();

    uv_cancel((uv_req_t*) &this->work_req);
    
    if(callback != NULL)
      delete callback;

    callback = new Nan::Callback(info[0].As<v8::Function>());
    mutex_callback.unlock();
}





#endif


