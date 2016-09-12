const expect= require('chai').expect
const Bucket = require('../src/bucket')


describe('Bucket Tests', function(){
  describe('Create Bucket', function(){
    console.log(Bucket)
    let bucket = new Bucket(4)
    expect(bucket).to.exist
  })

})