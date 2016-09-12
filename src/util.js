const fnv = require('fnv-plus')

function hash (buf) {
  if (!Buffer.isBuffer(buf)) {
    throw new TypeError("Invalid Buffer")
  }
  let hash = 5381
  for (let i = 0; i < buf.length; i++) {
    hash = (((hash << 5) >>> 0 ) + hash) + buf[ i ]
  }
  return hash
}
function fnvHash (buf) {
  if (!Buffer.isBuffer(buf)) {
    throw new TypeError("Invalid Buffer")
  }
  let hash = fnv.hash(buf.toString(), 64)
  return new Buffer(hash.hex(), 'hex')
}

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function numberToBuffer (num) {
  if (isNaN(num)) {
    throw new TypeError('Invalid Number')
  }
  let hex = number.toString(16)
  if (hex % 2 == 1) {
    hex = '0' + hex
  }
  return new Buffer(hex)
}
module.exports = {
  hash: hash,
  fnvHash: fnvHash,
  getRandomInt: getRandomInt,
  numberToBuffer: numberToBuffer
}