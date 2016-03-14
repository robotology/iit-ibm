



#include "YarpJS_Callbackable.h"





using namespace v8;







void YarpJS_Callbackable::_internal_worker(uv_work_t *req)
{
  
}

void YarpJS_Callbackable::_internal_worker_end(uv_work_t *req, int status)
{
    if (status == UV_ECANCELED)
      return;

    YarpJS_Callbackable *tmp_this = static_cast<YarpJS_Callbackable *>(req->data);

    Nan::HandleScope scope;

    std::vector<v8::Local<v8::Value> > tmp_arguments;
    tmp_this->prepareCallback(tmp_arguments);
    tmp_this->callback->Call(tmp_arguments.size(),tmp_arguments.data());

    tmp_this->mutex_callback.unlock();
}


void YarpJS_Callbackable::_callCallback()
{
    mutex_callback.lock();
    uv_queue_work(uv_default_loop(),&this->work_req,YarpJS_Callbackable::_internal_worker,YarpJS_Callbackable::_internal_worker_end);
}



void YarpJS_Callbackable::_setCallback(const Nan::FunctionCallbackInfo<v8::Value> &info)
{
    mutex_callback.lock();

    uv_cancel((uv_req_t*) &this->work_req);
    
    if(callback != NULL)
      delete callback;

    callback = new Nan::Callback(info[0].As<Function>());
    mutex_callback.unlock();
}














