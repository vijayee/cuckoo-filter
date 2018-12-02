const crypto = require('crypto')
const CuckooFilter = require('../src/cuckoo-filter')
const expect = require('chai').expect
describe('Test Cuckoo Filter', function () {
  let keys =[]
  let cuckoo = new CuckooFilter(1500, 6 , 4)
  let cuckoo2
  it('Add 1500 keys', function() {
    for(let i = 0; i < 1500; i++ ) {
      let rand = crypto.randomBytes(36)
      keys.push(rand)
      let result = cuckoo.add(rand)
      expect(result).to.equal(true)
    }
    expect(cuckoo.count).to.equal(1500)
  })
  it('Check 1500 keys are in filter', function () {
    for(let key of keys) {
      expect(cuckoo.contains(key)).to.equal(true)
    }
  })
  it('Serialize Cuckoo filter', function () {
    let buf = cuckoo.toCBOR()
    expect(Buffer.isBuffer(buf)).to.equal(true)
    cuckoo2 = CuckooFilter.fromCBOR(buf)
    expect(cuckoo2 instanceof CuckooFilter).to.equal(true)
  })
  it('Check Check 1500 keys are in Serialized Cuckoo filter', function () {
    for (let key of keys) {
      expect(cuckoo2.contains(key)).to.equal(true)
    }
  })
})



//console.log(cuckoo.reliable)
/*
console.log(cuckoo.contains(1))
let cbor = cuckoo.toCBOR()
console.log(cbor)
console.log(`size: ${cbor.length}`)
let cuckoo2 = CuckooFilter.fromCBOR(cbor)
console.log(cuckoo2.contains(1))
*/

/*
 keys.forEach((key)=>{
 console.log(`key ${key.toString('hex')} contained ${ cuckoo.contains(key)}`)
 })
 */
/*
 const Fingerprint= require('./fingerprint')
 const Bucket = require('./bucket')
 let buf = new Buffer('COSMIC POWER')
 let buf2 = new Buffer('Primordial Soup')
 let buf3 = new Buffer('Quadrafloops')
 let buf4 = new Buffer('MEtacloriasn')
 let buf5 = new Buffer('Gin')
 let fp = new Fingerprint(buf)
 let fp2 = new Fingerprint(buf2)
 let fp3 = new Fingerprint(buf3)
 let fp4 = new Fingerprint(buf4)
 let fp5 = new Fingerprint(buf5)
 let bucket = new Bucket(4)
 let cuckoo = new CuckooFilter(1)
 //console.log(cuckoo.contains(buf5))
 console.log(cuckoo.add(buf))
 console.log(cuckoo.add(buf2))
 console.log(cuckoo.add(buf3))
 console.log(cuckoo.add(buf4))
 console.log(cuckoo.add(buf5))

 console.log(cuckoo.remove(buf5))
 console.log(cuckoo.count)*/
//console.log(cuckoo.contains(buf5))
//console.log(cuckoo.remove(buf5))
/*
 console.log(fp.hash())
 console.log(fp2.equals(fp))
 console.log(bucket.add(fp))
 console.log(bucket.add(fp2))
 console.log(bucket.add(fp3))
 console.log(bucket.add(fp4))
 console.log(bucket.add(fp5))
 console.log(bucket.contains(fp))
 console.log(bucket.contains(fp5))
 console.log(bucket.swap(fp5))
 console.log(bucket.contains(fp5))
 console.log(bucket.remove(fp5))
 console.log(bucket.contains(fp5))
 console.log(fp5.hash())
 */
