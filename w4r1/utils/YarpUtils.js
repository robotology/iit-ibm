/**
 * Functions to support Yarp ports in exchanging messages
 */

function encodeBottleJson(msg){
	var msgString = JSON.stringify(msg);
	return encodeBottleString(msgString);
}

function decodeBottleJson(msg){
	var msgString = decodeBottleString(msg);
	var msgJson = JSON.parse(msgString);
	return msgJson;
}

function decodeBottleString(msg){
        var msgEscaped = msg;
//	var msgEscaped = msg.substring(1,msg.length-1);
	var msgUnescaped = msgEscaped.replace(/""/g,'"');
	return msgUnescaped;
}

function encodeBottleString(msg){
console.log("Encoding string: ",msg);
	var msgEscaped = msg.replace(/"/g,'""');
	var msgEncoded = '"';
	msgEncoded = msgEncoded.concat(msgEscaped).concat('"');
	return msgEncoded;
}

function test_string(){
console.log("TEST");
var j = {"a":"b",'c':'d'};
var ej = encodeBottleJson(j);
var dj = decodeBottleJson(ej);
console.log("JSON TEST: ",j,ej,dj);
//var res = encodeBottleString('"Ciao"');
//console.log("JSON",msg);
//console.log(eco

var str = '"Ciao ",""Ciao""';
console.log("String: ",str);
var res = encodeBottleString(str);
console.log("EncodedString: ",res);
console.log("DecodedDeciodedString: ",decodeBottleString(res));
}

module.exports = {
encodeBottleJson,
decodeBottleJson,
encodeBottleString,
decodeBottleString
}
