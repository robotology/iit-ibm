const { Transform } = require('stream')

class StreamChunker extends Transform {
  constructor (size) {
    super();

    	this.size = size || 32000 //NOTE: Must be two times the value of NUM_SAMPLES defined in YarpJS_Sound.cpp
    	this.buffer = Buffer.alloc(0);
	this.padding =true; //use padding to avoid noise at the and of the last sound chunk
  }

  _transform (chunk, _, next) {
      console.log("Chunker processing: ",chunk.length,chunk);
      const buf = Buffer.concat([this.buffer, chunk])
      var outBuff;
      let i = 0
      for (; i <= buf.length - this.size; i += this.size) {
    	     outBuff = buf.slice(i, i + this.size);
             console.log("Chunker sending",outBuff.length,outBuff);
             this.push(outBuff);
         }
         this.buffer = buf.slice(i);
	 console.log("Chunker left",this.buffer.length);
         next()
  }

  _flush (next) {
	 console.log("Chunker flush");
	 if(this.buffer.length > 0) {    
         	if (this.padding && this.buffer.length < this.size) {
             		const zeroes = Buffer.alloc(this.size - this.buffer.length);
             		this.push(Buffer.concat([this.buffer, zeroes]));
         	} else {
             		this.push(this.buffer);
         	}
	}
        next();
  }
}

module.exports = StreamChunker;
