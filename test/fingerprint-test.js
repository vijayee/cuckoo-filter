const expect= require('chai').expect
const Fingerprint = require('../src/bucket')

let bucket
describe('Bucket Tests', ()=>{
  describe('Create Bucket', ()=>{
    bucket = new Bucket(4)
    expect(bucket).to.exist
  })

})
