'use strict';

require('co-mocha');
const path = require('path');
const assert = require('assert');
const fs = require('fs-extra');
const Util = require('../src/util');

describe('Decode data', () => {
  let util;
  beforeEach(() => {
    util = new Util(path.join(__dirname, '.', 'assets/FitnessApp.sketch'));
  });

  it('Should return document data.', function*() {
    // console.log(util);

    const data = yield util.getDocumentData();
    // console.log(JSON.stringify(res));
    assert(typeof data === 'object');
  });

  it.only('Should return page list data.', function*() {
    // console.log(util);

    const data1 = yield util.getPageDataList();
    yield fs.writeJson('./page.json', data1);
    util.needSketchTool = false;
    util.pageDataList = null;
    const data2 = yield util.getPageDataList();
    yield fs.writeJson('./page1.json', data2);
    yield fs.writeJson('./page2.json', util._mapName(data2));
    // console.log(JSON.stringify(res));
    // console.log(data1);
    // console.log(data2);

    assert(typeof data2 === 'object');
  });

  it('Should return meta data.', function*() {
    // console.log(util);

    const data = yield util.getMeta();
    // console.log(JSON.stringify(res));
    console.log(data);
    assert(typeof data === 'object');
  });
});
