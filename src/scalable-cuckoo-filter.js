'use strict'
const cbor = require('cbor-js')
const CuckooFilter = require('./cuckoo-filter')
let _filterSeries = new WeakMap()
let _scale = new WeakMap()
let _bSize = new WeakMap()
let _cfSize = new WeakMap()
let _fpSize = new WeakMap()

module.exports = class ScalableCuckooFilter {
  constructor (cfSize, bSize, fpSize, scale) {
    if (typeof cfSize === 'object') {
      if (!isNaN(cfSize.cfSize)) {
        if (!Number.isInteger(cfSize.cfSize)) {
          throw new TypeError('Invalid Cuckoo Filter Size')
        }
        _cfSize.set(this, cfSize.cfSize)
      } else {
        throw new TypeError('Invalid Cuckoo Filter Size')
      }
      if (!isNaN(cfSize.bSize)) {
        if (!Number.isInteger(cfSize.bSize)) {
          throw new TypeError('Invalid Bucket Size')
        }
        _bSize.set(this, cfSize.bSize)
      } else {
        throw new TypeError('Invalid Bucket Size')
      }
      if (!isNaN(cfSize.fpSize)) {
        if (!Number.isInteger(cfSize.fpSize) || cfSize.fpSize > 64) {
          throw new TypeError('Invalid Fingerprint Size')
        }
        _fpSize.set(this, cfSize.fpSize)
      } else {
        throw new TypeError('Invalid Fingerprint Size')
      }
      if (!isNaN(cfSize.scale)) {
        if (!Number.isInteger(cfSize.scale)) {
          throw new TypeError('Invalid Scale')
        }
        _scale.set(this, cfSize.scale)
      } else {
        throw new TypeError('Invalid Scale')
      }
      if (cfSize.filterSeries) {
        let filterSeries = cfSize.filterSeries.map((cuckoo)=> { return new CuckooFilter(cuckoo)})
        _filterSeries.set(this, filterSeries)
      } else {
        throw new TypeError('Invalid Filter Series')
      }
    } else {
      if (!scale) {
        scale = 2
      }
      if (!bSize) {
        bSize = 4
      }
      if (!fpSize) {
        fpSize = 2
      }
      if (!cfSize) {
        cfSize = (1 << 18) / bSize
      }
      if (!Number.isInteger(scale)) {
        throw new TypeError('Invalid Scale')
      }
      if (!Number.isInteger(cfSize)) {
        throw new TypeError('Invalid Cuckoo Filter Size')
      }
      if (!Number.isInteger(fpSize) || fpSize > 64) {
        throw new TypeError('Invalid Fingerprint Size')
      }
      if (!Number.isInteger(bSize)) {
        throw new TypeError('Invalid Bucket Size')
      }
      let filterSeries = []
      let cuckoo = new CuckooFilter(cfSize, bSize, fpSize)
      filterSeries.push(cuckoo)
      _filterSeries.set(this, filterSeries)
      _fpSize.set(this, fpSize)
      _bSize.set(this, bSize)
      _cfSize.set(this, cfSize)
      _scale.set(this, scale)
    }
  }

  add (item) {
    if (!this.contains(item)) {
      let filterSeries = _filterSeries.get(this)
      let current = filterSeries.find((cuckoo)=> {
        return cuckoo.reliable
      })
      if (!current) {
        let fpSize = _fpSize.get(this)
        let cfSize = _cfSize.get(this)
        let bSize = _bSize.get(this)
        let scale = _scale.get(this)
        let curSize = cfSize * Math.pow(scale, filterSeries.length)
        current = new CuckooFilter(curSize, bSize, fpSize)
        filterSeries.push(current)
      }
      return current.add(item)
    }
    return false
  }

  contains (item) {
    let filterSeries = _filterSeries.get(this)
    let found = false
    for (let i = 0; i < filterSeries.length; i++) {
      found = filterSeries[ i ].contains(item)
      if (found) {
        break;
      }
    }
    return found
  }

  remove (item) {
    let filterSeries = _filterSeries.get(this)
    let found = false
    let i
    for (i = 0; i < filterSeries.length; i++) {
      found = filterSeries[ i ].remove(item)
      if (found) {
        return true
      }
    }
    return false
  }

  get count () {
    let filterSeries = _filterSeries.get(this)
    let sum = 0
    for (let i = 0; i < filterSeries.length; i++) {
      sum += filterSeries[ i ].count
    }
    return sum
  }

  toJSON () {
    let fpSize = _fpSize.get(this)
    let cfSize = _cfSize.get(this)
    let bSize = _bSize.get(this)
    let scale = _scale.get(this)
    let filterSeries = _filterSeries.get(this)

    return {
      cfSize: cfSize,
      fpSize: fpSize,
      bSize: bSize,
      scale: scale,
      filterSeries: filterSeries.map((filter)=> {return filter.toJSON()})
    }
  }

  static fromJSON (obj) {
    return new ScalableCuckooFilter(obj)
  }

  toCBOR(){
    return Buffer.from(cbor.encode(this.toJSON()))
  }
  static fromCBOR(buf){
    let obj = cbor.decode(buf.buffer)
    return ScalableCuckooFilter.fromJSON(obj)
  }
}
