// Type definitions for cuckoo-filter 1.1.3

/// <reference types="node" />

export class CuckooFilter extends ScalableCuckooFilter {
  constructor(size?: number, bucketSize?: number, fingerPrintSize?: number);
  reliable: boolean;
}

export class ScalableCuckooFilter {
  constructor(size?: number, bucketSize?: number, fingerPrintSize?: number, scale?: number);
  count: number;
  add(item: number | string | Buffer): boolean;
  contains(item: number | string | Buffer): boolean;
  remove(item: number | string | Buffer): boolean;
  toJSON(): any;                 // TODO: define the object
  toCBOR(): Buffer;
}

export namespace CuckooFilter {
  function fromCBOR(buffer: Buffer): CuckooFilter;
  function fromJSON(obj: any): CuckooFilter;
}

export namespace ScalableCuckooFilter {
  function fromCBOR(buffer: Buffer): ScalableCuckooFilter;
  function fromJSON(obj: any): ScalableCuckooFilter;
}
