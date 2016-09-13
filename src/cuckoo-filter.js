'use strict'
const Bucket = require('./bucket')
const Fingerprint = require('./fingerprint')
const util = require('./util')
const maxCuckooCount = 500
let _bSize = new WeakMap()
let _cfSize = new WeakMap()
let _fpSize = new WeakMap()
let _buckets = new WeakMap()
let _count = new WeakMap()
module.exports = class CuckooFilter {
  constructor (cfSize, bSize, fpSize) {
    if (!Buffer.isBuffer(cfSize) && typeof cfSize === 'object') {
      if (cfSize.cfSize) {
        _cfSize.set(this, cfSize.cfSize)
      } else {
        throw new TypeError('Invalid Cuckoo Filter Size')
      }
      if (cfSize.bSize) {
        _bSize.set(this, cfSize.bSize)
      } else {
        throw new TypeError('Invalid Bucket Size')
      }
      if (cfSize.fpSize) {
        _fpSize.set(this, cfSize.fpSize)
      } else {
        throw new TypeError('Invalid Fingerprint Size')
      }
      if (cfSize.count) {
        _count.set(this, cfSize.count)
      } else {
        throw new TypeError('Invalid Count')
      }
      if (cfSize.buckets) {
        let buckets = cfSize.buckets.map((bucket)=> {
          if (!bucket) {
            return null
          } else {
            return new Bucket(bucket)
          }
        })
        _buckets.set(this, buckets)
      } else {
        throw new TypeError('Invalid Buckets')
      }
    }
    else {
      if (!bSize) {
        bSize = 4
      }
      if (!fpSize) {
        fpSize = 2
      }
      if (!cfSize) {
        cfSize = (1 << 18) / bSize
      }
      if (!Number.isInteger(cfSize)) {
        throw new TypeError('Invalid Cuckoo Filter Size')
      }
      if (!Number.isInteger(fpSize) && fpSize < 64) {
        throw new TypeError('Invalid Fingerprint Size')
      }
      if (!Number.isInteger(bSize)) {
        throw new TypeError('Invalid Bucket Size')
      }

      _fpSize.set(this, fpSize)
      _bSize.set(this, bSize)
      _cfSize.set(this, cfSize)
      _count.set(this, 0)
      let buckets = []
      for (let i = 0; i < cfSize; i++) {
        buckets.push(null)
      }
      _buckets.set(this, buckets)
    }
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
    let bSize = _bSize.get(this)
    let fpSize = _fpSize.get(this)
    let cfSize = _cfSize.get(this)
    let count = _count.get(this)
    let buckets = _buckets.get(this)
    let fingerprint = new Fingerprint(buf, fpSize)
    let j = util.hash(buf) % cfSize
    let k = (j ^ fingerprint.hash()) % cfSize
    if (!buckets[ j ]) {
      buckets[ j ] = new Bucket(bSize)
    }
    if (!buckets[ k ]) {
      buckets[ k ] = new Bucket(bSize)
    }
    if (buckets[ j ].add(fingerprint) || buckets[ k ].add(fingerprint)) {
      count++
      _count.set(this, count)
      return true
    }
    let rand = [ j, k ]
    let i = rand[ util.getRandomInt(0, rand.length - 1) ]
    if (!buckets[ i ]) {
      buckets[ i ] = new Bucket(bSize)
    }
    for (let n = 0; n < maxCuckooCount; n++) {
      fingerprint = buckets[ i ].swap(fingerprint)
      i ^= fingerprint.hash() % cfSize
      if (!buckets[ i ]) {
        buckets[ i ] = new Bucket(bSize)
      }
      if (buckets[ i ].add(fingerprint)) {
        count++
        _count.set(this, count)
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
    let fpSize = _fpSize.get(this)
    let cfSize = _cfSize.get(this)
    let buckets = _buckets.get(this)
    let fingerprint = new Fingerprint(buf, fpSize)
    let j = util.hash(buf) % cfSize
    let k = (j ^ fingerprint.hash()) % cfSize
    return (buckets[ j ] ? buckets[ j ].contains(fingerprint) : false) || ( buckets[ k ] ? buckets[ k ].contains(fingerprint) : false)
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
    let fpSize = _fpSize.get(this)
    let cfSize = _cfSize.get(this)
    let count = _count.get(this)
    let buckets = _buckets.get(this)
    let fingerprint = new Fingerprint(buf, fpSize)
    let j = util.hash(buf) % cfSize
    let k = (j ^ fingerprint.hash()) % cfSize
    if ((buckets[ j ] ? buckets[ j ].remove(fingerprint) : false ) || (buckets[ k ] ? buckets[ k ].remove(fingerprint) : false)) {
      count--
      _count.set(this, count)
      return true
    }
    return false
  }

  get count () {
    return _count.get(this)
  }

  get reliable () {
    let cfSize = _cfSize.get(this)
    return Math.floor(100 * (this.count / cfSize)) <= 95
  }

  toJSON () {
    let fpSize = _fpSize.get(this)
    let cfSize = _cfSize.get(this)
    let count = _count.get(this)
    let buckets = _buckets.get(this)
    let bSize = _bSize.get(this)
    return {
      cfSize: cfSize,
      fpSize: fpSize,
      bSize: bSize,
      count: count,
      buckets: buckets.map((bucket)=> {
        if (!bucket) {
          return null
        } else {
          return bucket.toJSON()
        }
      })
    }
  }

  static fromJSON (obj) {
    return new CuckooFilter(obj)
  }
}