'use strict';
var Buffer = require('../../').Buffer;
require('./common');
const assert = require('assert');

// Test hex strings and bad hex strings
{
  let buf = Buffer.alloc(4);
  assert.strictEqual(buf.length, 4);
  assert.deepStrictEqual(buf, new Buffer([0, 0, 0, 0]));
  assert.strictEqual(buf.write('abcdxx', 0, 'hex'), 2);
  assert.deepStrictEqual(buf, new Buffer([0xab, 0xcd, 0x00, 0x00]));
  assert.strictEqual(buf.toString('hex'), 'abcd0000');
  assert.strictEqual(buf.write('abcdef01', 0, 'hex'), 4);
  assert.deepStrictEqual(buf, new Buffer([0xab, 0xcd, 0xef, 0x01]));
  assert.strictEqual(buf.toString('hex'), 'abcdef01');
  // Node Buffer behavior check
  // > Buffer.from('abc def01','hex')
  // <Buffer ab>
  buf = Buffer.alloc(4);
  assert.strictEqual(buf.write('abc def01', 0, 'hex'), 1);
  assert.deepStrictEqual(buf, new Buffer([0xab, 0x0, 0x0, 0x0]));
  assert.strictEqual(buf.toString('hex'), 'ab000000');

  const copy = Buffer.from(buf.toString('hex'), 'hex');
  assert.strictEqual(buf.toString('hex'), copy.toString('hex'));
}

{
  const buf = Buffer.alloc(5);
  assert.strictEqual(buf.write('abcdxx', 1, 'hex'), 2);
  assert.strictEqual(buf.toString('hex'), '00abcd0000');
}

{
  const buf = Buffer.alloc(4);
  assert.deepStrictEqual(buf, new Buffer([0, 0, 0, 0]));
  assert.strictEqual(buf.write('xxabcd', 0, 'hex'), 0);
  assert.deepStrictEqual(buf, new Buffer([0, 0, 0, 0]));
  assert.strictEqual(buf.write('xxab', 1, 'hex'), 0);
  assert.deepStrictEqual(buf, new Buffer([0, 0, 0, 0]));
  assert.strictEqual(buf.write('cdxxab', 0, 'hex'), 1);
  assert.deepStrictEqual(buf, new Buffer([0xcd, 0, 0, 0]));
}

{
  const buf = Buffer.alloc(256);
  for (let i = 0; i < 256; i++)
    buf[i] = i;

  const hex = buf.toString('hex');
  assert.deepStrictEqual(Buffer.from(hex, 'hex'), buf);

  const badHex = `${hex.slice(0, 256)}xx${hex.slice(256, 510)}`;
  assert.deepStrictEqual(Buffer.from(badHex, 'hex'), buf.slice(0, 128));
}

