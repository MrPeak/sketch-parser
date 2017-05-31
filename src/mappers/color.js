'use strict';

const _ = require('lodash');
// NSColor

module.exports = function(obj) {
  if (obj._class !== 'color') return obj;

  if (
    _.has(obj, 'alpha') ||
    _.has(obj, 'blue') ||
    _.has(obj, 'red') ||
    _.has(obj, 'green')
  ) {
    // Need transform
    const alpha = _.get(obj, 'alpha');
    const red = _.get(obj, 'red');
    const green = _.get(obj, 'green');
    const blue = _.get(obj, 'blue');

    delete obj.alpha;
    delete obj.red;
    delete obj.green;
    delete obj.blue;

    obj.value = `rgba(${red},${green},${blue},${alpha})`;

    return obj;
  }
};
