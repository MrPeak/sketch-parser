'use strict';

// "{1, 1}"
const regex1 = /^\s*\{\s*(.+?)\s*,\s*(.+?)\s*\}\s*$/;

// "{{0, 0}, {1, 1}}"
const regex2 = /^\s*\{\s*\{\s*(.+?)\s*,\s*(.+?)\s*\}\s*,\s*\{\s*(.+?)\s*,\s*(.+?)\s*\}\s*\s*\}$/;

/**
 * Unzip value string
 *
 * @param {string} value - String
 * @return {string|Object} value object
 */
const unzip = value => {
  if (typeof value !== 'string') return value;
  const matchArr1 = value.match(regex1);
  const matchArr2 = value.match(regex2);

  const valueObj = {};

  if (matchArr2 && matchArr2.length === 5) {
    // Two dimensions
    valueObj.x = parseFloat(matchArr2[1]);
    valueObj.y = parseFloat(matchArr2[2]);
    valueObj.width = parseFloat(matchArr2[3]);
    valueObj.height = parseFloat(matchArr2[4]);
  } else if (matchArr1 && matchArr1.length === 3) {
    // One dimension
    // TODO: distinguish
    valueObj.x = parseFloat(matchArr1[1]);
    valueObj.y = parseFloat(matchArr1[2]);
    valueObj.width = parseFloat(matchArr1[1]);
    valueObj.height = parseFloat(matchArr1[2]);
  } else {
    return value;
  }

  return valueObj;
};

module.exports = unzip;
