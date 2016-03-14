



#include "YarpJS_BufferedPort_Image.h"



using namespace v8;





Nan::Persistent<v8::FunctionTemplate>  YarpJS_BufferedPort_Image::constructor;




void YarpJS_BufferedPort_Image::prepareCallback(std::vector<v8::Local<v8::Value> > &tmp_arguments)
{
    // create a new YarpJS_Image
    v8::Local<v8::Value> argv[1] = {Nan::New(Nan::Null)};
    v8::Local<v8::Function> cons = Nan::GetFunction(Nan::New(YarpJS_Image::constructor)).ToLocalChecked();
    v8::Local<v8::Object> tmpImgJS = cons->NewInstance(1,argv);

    YarpJS_Image *tmpImg = Nan::ObjectWrap::Unwrap<YarpJS_Image>(tmpImgJS);
    
    tmpImg->setYarpObj(new yarp::sig::Image(this->datum));
    tmp_arguments.push_back(tmpImgJS);
}




// NAN_METHOD(YarpJS_BufferedPort_Image::Open) {

//   YarpJS_BufferedPort_Image* obj = Nan::ObjectWrap::Unwrap<YarpJS_BufferedPort_Image>(info.This());
  
//   v8::String::Utf8Value _port_name(info[0]->ToString());

//   obj->open(*_port_name);

// }


// NAN_METHOD(YarpJS_BufferedPort_Image::Close) {

//   YarpJS_BufferedPort_Image* obj = Nan::ObjectWrap::Unwrap<YarpJS_BufferedPort_Image>(info.This());
//   obj->close();

// }



// NAN_METHOD(YarpJS_BufferedPort_Image::SetOnReadCallback) {

//   YarpJS_BufferedPort_Image* obj = Nan::ObjectWrap::Unwrap<YarpJS_BufferedPort_Image>(info.This());
//   obj->_setCallback(info);

// }




// NAN_METHOD(YarpJS_BufferedPort_Image::Write) {

//   YarpJS_BufferedPort_Image* obj = Nan::ObjectWrap::Unwrap<YarpJS_BufferedPort_Image>(info.This());

//   v8::String::Utf8Value _port_name(info[0]->ToString());
  
//   // yarp::os::Image &bTmp = obj->prepare();
//   // bTmp.clear();
//   // bTmp.fromString(*_port_name);

//   obj->write();
// }





NAN_METHOD(YarpJS_BufferedPort_Image::Prepare) {

  YarpJS_BufferedPort_Image* obj = Nan::ObjectWrap::Unwrap<YarpJS_BufferedPort_Image>(info.This());


  // create a new YarpJS_Image
  v8::Local<v8::Value> argv[1] = {Nan::New(Nan::Null)};
  v8::Local<v8::Function> cons = Nan::GetFunction(Nan::New(YarpJS_Image::constructor)).ToLocalChecked();
  v8::Local<v8::Object> bPreparedJS = cons->NewInstance(1,argv);

  YarpJS_Image *bPrepared = Nan::ObjectWrap::Unwrap<YarpJS_Image>(bPreparedJS);
  
  bPrepared->setYarpObj(&obj->prepare());

  info.GetReturnValue().Set(bPreparedJS);
}




