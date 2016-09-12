const util = require('./util')
let _fp = new WeakMap()
const fpSize = 2
module.exports = class Fingerprint {
  constructor (buf) {
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError("Invalid Buffer")
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

  hash () {
    let fp = _fp.get(this)
    return util.hash(fp)
  }

  equals (fingerprint) {
    let fp1 = _fp.get(this)
    let fp2 = _fp.get(fingerprint)
    return Buffer.compare(fp1, fp2) === 0
  }

}