'use strict';

// Decode sketch base64 bpslit

const bplist = require('bplist');
const promisify = require('es6-promisify');

/**
 * Decode bqlist base64 string
 *
 * @param {string} encodedStr - encoded string
 * @param {string} [type] - decode type
 *
 * @return {Promise} parse result
 */
module.exports = (encodedStr, type) => {
  const plistBuf = new Buffer(encodedStr, type || 'base64');
  const parseBuffer = promisify(bplist.parseBuffer);

  return parseBuffer(plistBuf);
};
