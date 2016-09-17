const expect= require('chai').expect
const Bucket = require('../src/bucket')


describe('Bucket Tests', function(){
  describe('Create Bucket', function(){
    let bucket = new Bucket(4)
    expect(bucket).to.exist
  })

})
/*let keys =[]
 let cuckoo = new CuckooFilter(200000, 8 , 6)
 for(let i = 0; i < 2000000; i++ ){
 //let rand = crypto.randomBytes(36)
 //keys.push(rand)
 if(!cuckoo.add(i)){
 console.log(`rejected ${i}`)
 }
 }
 console.log(cuckoo.contains(1))
 let cbor = cuckoo.toCBOR()
 console.log(cbor)
 console.log(`size: ${cbor.length}`)
 let cuckoo2 = CuckooFilter.fromCBOR(cbor)
 console.log(cuckoo2.contains(1))
 *.
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
