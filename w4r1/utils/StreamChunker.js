const { Transform } = require('stream')

class StreamChunker extends Transform {
  constructor (size) {
    super();

    	this.size = size || 4096//176400
    	this.buffer = Buffer.alloc(0);
	this.padding =false;
  }

  _transform (chunk, _, next) {
      console.log("Chunker processing: ",chunk.length,chunk);
      const buf = Buffer.concat([this.buffer, chunk])
      var outBuff;
      let i = 0
      for (; i <= buf.length - this.size; i += this.size) {
    	     outBuff = buf.slice(i, i + this.size);
             console.log("Chunker sending",outBuff.length,outBuff);
             console.log("Chunker left",this.buffer.lenght);
             this.push(outBuff);
         }
         this.buffer = buf.slice(i)
         next()
  }

  _flush (next) {
	     console.log("Chunker flush");
         if (this.padding && this.buffer.length > 0) {
             const zeroes = Buffer.alloc(this.size - this.buffer.length)
             this.push(Buffer.concat([this.buffer, zeroes]))
         } else {
             this.push(this.buffer)
         }
         next()
  }
}

module.exports = StreamChunker
