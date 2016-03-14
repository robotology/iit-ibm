

#ifndef YARP_JS_H
#define YARP_JS_H


#include <nan.h>
#include <string>



#define YARPJS_BASE(_AAA,_js_name)         static Nan::Persistent<v8::FunctionTemplate>            constructor;  static NAN_MODULE_INIT(Init) {                                  v8::Local<v8::FunctionTemplate> tpl = Nan::New<v8::FunctionTemplate>(New);                                                                      tpl->SetClassName(Nan::New(_js_name).ToLocalChecked());                                                                                         tpl->InstanceTemplate()->SetInternalFieldCount(1);                                                                                              setJSMethods(tpl);                                   constructor.Reset(tpl);                                    Nan::Set(target, Nan::New(_js_name).ToLocalChecked(), Nan::GetFunction(tpl).ToLocalChecked());                                  }        static NAN_METHOD(New) {                                  if (info.IsConstructCall()) {                                     _AAA* obj = new _AAA(info);                                     obj->Wrap(info.This());                                     info.GetReturnValue().Set(info.This());                                   } else {                                     const int argc = 1;                                     v8::Local<v8::Value> argv[argc] = {info[0]};                                     v8::Local<v8::Function> cons = Nan::GetFunction(Nan::New(constructor)).ToLocalChecked();                                     info.GetReturnValue().Set(cons->NewInstance(argc, argv));                                   }                                  } 
#define YARPJS_INIT(_AAA,_js_name,_AAA_Parent)      static Nan::Persistent<v8::FunctionTemplate>            constructor;    static NAN_MODULE_INIT(Init) {                                  v8::Local<v8::FunctionTemplate> tpl = Nan::New<v8::FunctionTemplate>(New);     v8::Local<v8::FunctionTemplate> cons = Nan::New(_AAA_Parent::constructor);  tpl->Inherit(cons);                                                                  tpl->SetClassName(Nan::New(_js_name).ToLocalChecked());                                                                                         tpl->InstanceTemplate()->SetInternalFieldCount(1);                                                                                              setJSMethods(tpl);                                   constructor.Reset(tpl);                                    Nan::Set(target, Nan::New(_js_name).ToLocalChecked(), Nan::GetFunction(tpl).ToLocalChecked());                                  }        static NAN_METHOD(New) {                                  if (info.IsConstructCall()) {                                     _AAA* obj = new _AAA(info);                                     obj->Wrap(info.This());                                     info.GetReturnValue().Set(info.This());                                   } else {                                     const int argc = 1;                                     v8::Local<v8::Value> argv[argc] = {info[0]};                                     v8::Local<v8::Function> cons = Nan::GetFunction(Nan::New(constructor)).ToLocalChecked();                                     info.GetReturnValue().Set(cons->NewInstance(argc, argv));                                   }                                  } 


      


class YarpJS : public Nan::ObjectWrap {
private:
    
    static void setJSMethods(v8::Local<v8::FunctionTemplate> &tpl)
    {}

public:

    explicit YarpJS()
    {}

    explicit YarpJS(const Nan::FunctionCallbackInfo<v8::Value> &info)
    {}

    ~YarpJS()
    {}


    // NAN Stuff
    YARPJS_BASE(YarpJS,"YarpJS")
};




#endif



