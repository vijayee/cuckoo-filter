'use strict'
//const crypto = require('crypto')
const ScalableCuckooFilter = require('./scalable-cuckoo-filter')
const CuckooFilter = require('./cuckoo-filter')
module.exports ={ 
  CuckooFilter: CuckooFilter,
  ScalableCuckooFilter: ScalableCuckooFilter                     
}
let keys =[]
let cuckoo = new ScalableCuckooFilter(2000, 3 , 3,2)
for(let i = 0; i < 20000; i++ ){
  //let rand = crypto.randomBytes(36)
  //keys.push(rand)
  if(!cuckoo.add(i)){
    console.log(`rejected ${i}`)
  }
}
console.log(cuckoo.count)
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
