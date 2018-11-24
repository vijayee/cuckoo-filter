const fnv = require('fnv32')

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
  return fnv.toBufferLE(fnv.fnv_1a(buf))
}

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function numberToBuffer (num) {
  if (isNaN(num)) {
    throw new TypeError('Invalid Number')
  }
  let hex = num.toString(16)
  if (hex % 2 == 1) {
    hex = '0' + hex
  }
  return Buffer.from(hex, 'hex')
}
module.exports = {
  hash: hash,
  fnvHash: fnvHash,
  getRandomInt: getRandomInt,
  numberToBuffer: numberToBuffer
}