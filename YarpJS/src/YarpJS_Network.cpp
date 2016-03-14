

#include <stdio.h>
#include <string>

#include "YarpJS_Network.h"


using namespace v8;



Nan::Persistent<v8::FunctionTemplate>  YarpJS_Network::constructor;


NAN_METHOD(YarpJS_Network::Network_Init) {

  YarpJS_Network* obj = Nan::ObjectWrap::Unwrap<YarpJS_Network>(info.This());
  obj->getYarpObj()->init();

}

NAN_METHOD(YarpJS_Network::Fini) {

  YarpJS_Network* obj = Nan::ObjectWrap::Unwrap<YarpJS_Network>(info.This());
  obj->getYarpObj()->fini();

}
NAN_METHOD(YarpJS_Network::Connect) {

  YarpJS_Network* obj = Nan::ObjectWrap::Unwrap<YarpJS_Network>(info.This());

  v8::String::Utf8Value param1(info[0]->ToString());
  v8::String::Utf8Value param2(info[1]->ToString());

  // convert it to string
  std::string _src = std::string(*param1);    
  std::string _dst = std::string(*param2);    

  obj->getYarpObj()->connect(_src,_dst);

}


NAN_METHOD(YarpJS_Network::Disconnect) {


  YarpJS_Network* obj = Nan::ObjectWrap::Unwrap<YarpJS_Network>(info.This());

  v8::String::Utf8Value param1(info[0]->ToString());
  v8::String::Utf8Value param2(info[1]->ToString());

  // convert it to string
  std::string _src = std::string(*param1);    
  std::string _dst = std::string(*param2);    

  obj->getYarpObj()->disconnect(_src,_dst);

}













