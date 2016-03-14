

#include <stdio.h>
#include <string>

#include "YarpJS_Bottle.h"





using namespace v8;

Nan::Persistent<v8::FunctionTemplate>  YarpJS_Bottle::constructor;


v8::Local<v8::Array>& YarpJS_Bottle::toArray(const yarp::os::Bottle *bObj)
{
  const int bSize = bObj->size();

  v8::Local<v8::Array> bArr = Nan::New<v8::Array>(bSize);

  for(int i=0; i<bSize; i++)
      if(bObj->get(i).isList())
        Nan::Set(bArr, i, YarpJS_Bottle::toArray(bObj->get(i).asList()) );
      else
        Nan::Set(bArr, i, Nan::New(bObj->get(i).toString().c_str()).ToLocalChecked() );

  return bArr;

}



NAN_METHOD(YarpJS_Bottle::ToArray) {

  YarpJS_Bottle* obj = Nan::ObjectWrap::Unwrap<YarpJS_Bottle>(info.This());
  
  v8::Local<v8::Array> bArr = YarpJS_Bottle::toArray(obj->getYarpObj());

  info.GetReturnValue().Set(bArr);


}




NAN_METHOD(YarpJS_Bottle::FromString) {

  YarpJS_Bottle* obj = Nan::ObjectWrap::Unwrap<YarpJS_Bottle>(info.This());

  obj->fromString(info);

  info.GetReturnValue().Set(info.This());
}



NAN_METHOD(YarpJS_Bottle::GetObjType) {

  info.GetReturnValue().Set(Nan::New("bottle").ToLocalChecked());
}





// NAN_METHOD(YarpJS_Bottle::GetElement) {

//   YarpJS_Bottle* obj = Nan::ObjectWrap::Unwrap<YarpJS_Bottle>(info.This());

//   if(!info[0]->IsUndefined())
//   {
//     int idx = Nan::To<int>(info[0]).FromJust();

//     if(obj->getYarpObj()->get(idx).isList())
//     {
//       // create a new YarpJS_Bottle
//       v8::Local<v8::Value> argv[1] = {Nan::New(Nan::Null)};
//       v8::Local<v8::Function> cons = Nan::GetFunction(Nan::New(YarpJS_Bottle::constructor)).ToLocalChecked();
//       v8::Local<v8::Object> subBottleJS = cons->NewInstance(1,argv);

//       YarpJS_Bottle *subBottle = Nan::ObjectWrap::Unwrap<YarpJS_Bottle>(subBottleJS);
      
//       subBottle->setYarpObj(obj->getYarpObj()->get(idx).asList());

//       info.GetReturnValue().Set(bPreparedJS);
//     }
//     else
//     {
//       info.GetReturnValue().Set( Nan::New(obj->getYarpObj()->get(idx).toString().c_str()).ToLocalChecked() ); 
//     }
// }









