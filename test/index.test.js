'use strict';

require('co-mocha');
const path = require('path');
const assert = require('assert');
const fs = require('fs-extra');
const Parser = require('../src');

describe('Decode data', () => {
  let parser;
  beforeEach(() => {
    parser = new Parser(path.join(__dirname, '.', 'assets/FitnessApp.sketch'));
  });

  it('Should return document data.', function*() {
    // console.log(parser);

    const data = yield parser.getDocumentData();
    // console.log(JSON.stringify(res));
    assert(typeof data === 'object');
  });

  it('Should return page list data.', function*() {
    const data1 = yield parser.getPageDataList();
    yield fs.writeJson('./samples/sketchtoolPageDataList.json', data1);
    parser.needSketchTool = false;
    parser.pageDataList = null;
    const data2 = yield parser.getPageDataList();
    yield fs.writeJson('./samples/unzippedPageDataList.json', data2);

    assert(typeof data2 === 'object');
  });

  it('Should return meta data.', function*() {
    // console.log(parser);

    const data = yield parser.getMeta();
    // console.log(JSON.stringify(res));
    // console.log(data);
    assert(typeof data === 'object');
  });

  it('Should return flatten layer list.', function*() {
    const layerList = yield parser.getFlatLayerList();
    // yield fs.writeJson('./page.json', layerList);

    assert(typeof layerList === 'object');
  });

  it('Should set a default maxBuffer size', function*(){
    assert(parser.maxBuffer === 1024 * 8000);
  })

  it('Should take in account a passed maxBuffer size', function*(){
    const MAX_BUFFER_SIZE = 1024 * 10000;
    const parserWithBufferSize = new Parser(path.join(__dirname, '.', 'assets/FitnessApp.sketch'), false, MAX_BUFFER_SIZE);
    assert(parserWithBufferSize.maxBuffer === MAX_BUFFER_SIZE);
  })
});
