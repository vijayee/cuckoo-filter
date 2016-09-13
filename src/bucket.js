'use strict'
const Fingerprint = require('./fingerprint')
const util = require('./util')
let _contents = new WeakMap()

module.exports = class Bucket {
  constructor (size) {
    if (typeof size === 'object') {
      if (size.contents) {
        let contents = size.contents.map((fp)=> {
          if (fp) {
            return Fingerprint.fromJSON(fp)
          } else {
            return null
          }
        })
        _contents.set(this, contents)
      } else {
        throw TypeError('Invalid Bucket')
      }
    } else {
      if (!Number.isInteger(size)) {
        throw TypeError('Invalid size')
      }
      let contents = []
      for (let i = 0; i < size; i++) {
        contents.push(null)
      }
      _contents.set(this, contents)
    }
  }

  contains (fingerprint) {
    if (!(fingerprint instanceof Fingerprint)) {
      throw new TypeError('Invalid Fingerprint')
    }
    let contents = _contents.get(this)
    let found = contents.find((fp)=> { return fp ? fingerprint.equals(fp) : false})
    return !!found
  }

  add (fingerprint) {
    if (!(fingerprint instanceof Fingerprint)) {
      throw new TypeError('Invalid Fingerprint')
    }
    let contents = _contents.get(this)
    for (let i = 0; i < contents.length; i++) {
      if (!contents[ i ]) {
        contents[ i ] = fingerprint
        return true
      }
    }
    return false
  }

  swap (fingerprint) {
    if (!(fingerprint instanceof Fingerprint)) {
      throw new TypeError('Invalid Fingerprint')
    }
    let contents = _contents.get(this)
    let i = util.getRandomInt(0, contents.length - 1)
    let current = contents[ i ]
    contents[ i ] = fingerprint
    return current
  }

  remove (fingerprint) {
    if (!(fingerprint instanceof Fingerprint)) {
      throw new TypeError('Invalid Fingerprint')
    }
    let contents = _contents.get(this)
    let found = contents.findIndex((fp)=> { return fp ? fingerprint.equals(fp) : false})
    if (found > -1) {
      contents[ found ] = null
      return true
    } else {
      return false
    }
  }

  toJSON () {
    let contents = _contents.get(this)
    return {
      contents: contents.map((fp)=> {
        if (!fp) {
          return null
        } else {
          return fp.toJSON()
        }
      })
    }
  }

  static fromJSON (obj) {
    return new Bucket(obj)
  }
}
