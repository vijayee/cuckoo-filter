#Cuckoo Filters
##Abstract
In many networking systems, Bloom filters are used for highspeed
set membership tests. They permit a small fraction
of false positive answers with very good space efficiency.
However, they do not permit deletion of items from the set,
and previous attempts to extend “standard” Bloom filters to
support deletion all degrade either space or performance.
We propose a new data structure called the cuckoo filter
that can replace Bloom filters for approximate set membership
tests. Cuckoo filters support adding and removing items
dynamically while achieving even higher performance than
Bloom filters. For applications that store many items and
target moderately low false positive rates, cuckoo filters have
lower space overhead than space-optimized Bloom filters.
Our experimental results also show that cuckoo filters outperform
previous data structures that extend Bloom filters to
support deletions substantially in both time and space.

## Install
```
npm install cuckoo-filter
```

## Usage
```javascript
const CuckooFilter = require('cuckoo-filter').CuckooFilter
const ScalableFilter = require('cuckoo-filter').ScalableCuckooFilter

let cuckoo= new CuckooFilter(200, 4, 2) // (Size, Bucket Size, Finger Print Size)

let cuckoo2 = new ScalableCuckooFilter(2000, 4, 2, 2) // (Size, Bucket Size, Finger Print Size, Exponential Scale)

console.log(cuckoo.add('Your Momma'))//(buffer|string|number) returns true if successful
console.log(cuckoo.contains('Your Momma'))// true: She's definately in there
console.log(cuckoo.count) // 1
console.log(cuckoo.remove('Your daddy'))//false He's not home
console.log(cuckoo.reliable) // true less than 95% full
let json = cuckoo.toJSON() // serialize to json object
let cbor = cuckoo.toCBOR() // serialize to cbor


```
## Note
Size your buckets and fingerprints to avoid collisions.
Scalable cuckoo filters scale exponentially to hold your data.
