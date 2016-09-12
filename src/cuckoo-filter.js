const Bucket = require('./bucket')
const Fingerprint = require('./fingerprint')
const util = require('./util')
const maxCuckooCount = 500
const bSize = 4
const cfSize = (1 << 18) / bSize
const _buckets = new WeakMap()
const _size = new WeakMap()
module.exports = class CuckooFilter {
  constructor () {
    _size.set(this, 0)
    let buckets = []
    for (let i = 0; i < cfSize; i++) {
      buckets.push(new Bucket(bSize))
    }
    _buckets.set(this, buckets)
  }

  add (buf) {
    if (typeof buf === 'number') {
      buf = util.numberToBuffer(buf)
    }
    if (typeof buf === 'string') {
      buf = new Buffer(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('Invalid Buffer')
    }
    let size = _size.get(this)
    let buckets = _buckets.get(this)
    let fingerprint = new Fingerprint(buf)
    let j = util.hash(buf) % cfSize
    let k = (j ^ fingerprint.hash()) % cfSize
    if (buckets[ j ].add(fingerprint) || buckets[ k ].add(fingerprint)) {
      size++
      _size.set(this, size)
      return true
    }
    let rand = [ j, k ]
    let i = rand[ util.getRandomInt(0, rand.length - 1) ]
    for (let n = 0; n < maxCuckooCount; n++) {
      fingerprint = buckets[ i ].swap(fingerprint)
      i ^= fingerprint.hash() % cfSize
      if (buckets[ i ].add(fingerprint)) {
        size++
        _size.set(this, size)
        return true
      }
    }
    return false
  }

  contains (buf) {
    if (typeof buf === 'number') {
      buf = util.numberToBuffer(buf)
    }
    if (typeof buf === 'string') {
      buf = new Buffer(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('Invalid Buffer')
    }
    let buckets = _buckets.get(this)
    let fingerprint = new Fingerprint(buf)
    let j = util.hash(buf) % cfSize
    let k = (j ^ fingerprint.hash()) % cfSize
    return buckets[ j ].contains(fingerprint) || buckets[ k ].contains(fingerprint)
  }

  remove (buf) {
    if (typeof buf === 'number') {
      buf = util.numberToBuffer(buf)
    }
    if (typeof buf === 'string') {
      buf = new Buffer(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('Invalid Buffer')
    }
    let size = _size.get(this)
    let buckets = _buckets.get(this)
    let fingerprint = new Fingerprint(buf)
    let j = util.hash(buf) % cfSize
    let k = (j ^ fingerprint.hash()) % cfSize
    if (buckets[ j ].remove(fingerprint) || buckets[ k ].remove(fingerprint)) {
      size--
      _size.set(this, size)
      return true
    }
    return false
  }

  get size () {
    return _size.get(this)
  }
}