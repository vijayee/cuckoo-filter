'use strict'
let toBuffer = require('typedarray-to-buffer')
const util = require('./util')
let _fp = new WeakMap()
module.exports = class Fingerprint {
  constructor (buf, fpSize) {
    if (!Buffer.isBuffer(buf) && typeof buf === 'object') {
      if (buf.fp && buf.fp instanceof Uint8Array) {
        _fp.set(this, toBuffer(buf.fp))
      } else if (validFPObject(buf.fp)) {
        _fp.set(this, Buffer.from(buf.fp.data));
      } else {
        throw new TypeError('Invalid Fingerprint')
      }
    } else {
      if (!fpSize) {
        fpSize = 2
      }
      if (!Buffer.isBuffer(buf)) {
        throw new TypeError("Invalid Buffer")
      }
      if (!Number.isInteger(fpSize) && fpSize < 64) {
        throw new TypeError('Invalid Fingerprint Size')
      }
      let fnv = util.fnvHash(buf)
      let fp = new Buffer(fpSize)
      for (let i = 0; i < fp.length; i++) {
        fp[ i ] = fnv[ i ]
      }
      if (fp.length === 0) {
        fp[ 0 ] = 7
      }
      _fp.set(this, fp)
    }
  }

  hash () {
    let fp = _fp.get(this)
    return util.hash(fp)
  }

  equals (fingerprint) {
    let fp1 = _fp.get(this)
    let fp2 = _fp.get(fingerprint)
    return Buffer.compare(fp1, fp2) === 0
  }

  toJSON () {
    let fp = _fp.get(this)
    return { fp: fp }
  }

  static fromJSON (obj) {
    return new Fingerprint(obj)
  }
}

function validFPObject(fp) {
    return fp.type === 'Buffer' && Array.isArray(fp.data);
}
