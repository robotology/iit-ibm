const { Transform } = require('stream')

class StreamChunker extends Transform {
  constructor (size) {
    super()

    this.size = size || 4096

    this.buffer = Buffer.alloc(0)
  }

  _transform (chunk, _, next) {
    const buf = Buffer.concat([this.buffer, chunk])

    let i = 0
    for (; i <= buf.length - this.size; i += this.size) {
      this.push(buf.slice(i, i + this.size))
    }

    this.buffer = buf.slice(i)
    next()
  }

  _flush (next) {
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
