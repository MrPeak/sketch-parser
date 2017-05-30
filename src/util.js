'use strict';

/**
 * Common util methods
 */

// Native
const os = require('os');
const path = require('path');
const assert = require('assert');

// Third-party
const _ = require('lodash');
const fs = require('fs-extra');
const decompress = require('decompress');
const exec = require('child_process').exec;
const traverse = require('traverse');
const formatAttribute = require('./format_attribute');
const map = require('./mappers/common');

/**
 * Util class
 *
 * @class Util
 */
class Util {
  /**
   * Creates an instance of Util.
   * @param {string} sketchFile - SketchApp's absolute file path
   * @param {boolean} isOSX - whether the platform is MacOSX or not.
   *
   * @memberof Util
   */
  constructor(sketchFile) {
    assert(
      path.isAbsolute(sketchFile),
      'SketchApp file\'s path must be absolute, plz check.'
    );

    this.needSketchTool = true;
    this.filePath = sketchFile;
    this.folderPath = null;
    this.isOSX = os.type().toLowerCase() === 'darwin'; // Parsing JSOn files in the zip bundle is recommended.
    this.useSketchTool = this.needSketchTool && this.isOSX;
  }

  set needSketchTool(val) {
    this._needSketchTool = val;
    this.useSketchTool = this._needSketchTool && this.isOSX;
  }

  get needSketchTool() {
    return this._needSketchTool;
  }

  _exec(cmd) {
    return new Promise((resolve, reject) => {
      exec(
        cmd,
        {
          maxBuffer: 1024 * 8000, // Buffer size limit: 1kb * 8000 = 8000kb
        },
        (err, stdout, stderr) => {
          if (err) return reject(err);
          console.error(stderr); // TODO: handle stderr
          resolve(stdout);
        }
      );
    });
  }
  _mapName(obj) {
    let str = JSON.stringify(obj);

    for (const key in map.props) {
      // map prop
      str = str.replace(new RegExp(`"${key}":`, 'g'), `"${map.props[key]}":`);
    }

    for (const key in map.values) {
      // map value
      str = str.replace(new RegExp(`:"${key}"`, 'g'), `:"${map.values[key]}"`);
    }

    for (const key in map.booleanValues) {
      // map boolean value
      str = str.replace(new RegExp(`:${key}`, 'g'), `:${map.booleanValues[key]}`);
    }

    return JSON.parse(str);
  }

  *getLayerData() {}

  *getArtBoardData() {}

  /**
   * Get meta info of the document
   *
   * @return {Object} meta
   *
   * @memberof Util
   */
  *getMeta() {
    let meta = null;

    if (this.useSketchTool) {
      // Mac OSX platform
      meta = JSON.parse(
        yield this._exec(`sketchtool metadata ${this.filePath}`)
      );
    } else {
      const folderPath = yield this.extraFile();
      const metaPath = path.join(folderPath, 'meta.json');
      meta = yield fs.readJson(metaPath);
    }

    return meta; // The metaData of two ways are the same, there's no need to kake it unanimous.
  }

  /**
   * Get page obj list of the document
   *
   * @return {Array} pageList
   *
   * @memberof Util
   */
  *getPageDataList() {
    if (this.pageDataList) return this.pageDataList;

    let pageDataList = [];

    if (this.useSketchTool) {
      // Mac OSX platform
      const documentData = JSON.parse(
        yield this._exec(`sketchtool dump ${this.filePath}`)
      );

      pageDataList = documentData.pages;
    } else {
      const folderPath = yield this.extraFile();
      const files = yield fs.readdir(path.join(folderPath, 'pages'));

      for (const _ref of files) {
        const pagePath = path.join(folderPath, 'pages', _ref);
        const pageData = yield fs.readJson(pagePath);
        const tmpMap = new Map();
        // text style transform
        traverse(pageData).map(function(x) {
          if (x.encodedAttributes && x._class.toLowerCase() === 'textstyle') {
            tmpMap.set(this.path, x);
          }
        });

        for (let [key, value] of tmpMap) {
          // tranform data
          value = yield formatAttribute(value);
          _.set(pageData, key, value);
          // debugger;
        }

        pageDataList.push(pageData);
      }
    }

    // pageDataList = this._mapName(pageDataList);
    this.pageDataList = pageDataList;
    return pageDataList;
  }

  /**
   * Get document data obj
   *
   * @return {Object} documentData
   *
   * @memberof Util
   */
  *getDocumentData() {
    if (this.documentData) return this.documentData;

    let documentData = null;
    const filePath = this.filePath;

    if (this.useSketchTool) {
      // Mac OSX platform
      // Use the sketchtool first, for file compatibility which was creadted/modified by Sketch App belowed version 43 😤
      documentData = JSON.parse(
        yield this._exec(`sketchtool dump ${filePath}`)
      );
    } else {
      // Else platforms
      // Copy origin .sketch file and unzip it 🤡
      const folderPath = yield this.extraFile();
      // Extra success
      documentData = yield fs.readJson(path.join(folderPath, 'document.json')); // document structure
      // Read JSON success
      const pageList = yield this.getPageDataList();
      // Get page list success
      // Override ·document.pages·
      documentData.pages = pageList;
    }

    // documentData = this._mapName(documentData);
    this.documentData = documentData;
    return documentData;
  }

  /**
   * unzip `.sketch` file
   *
   * @return {string} dirPath unzip output path
   *
   * @memberof Util
   */
  *extraFile() {
    if (this.folderPath) return this.folderPath;
    const filePath = this.filePath;
    const destZipPath = `./tmp/${path.basename(filePath)}`;
    const dirPath = path.dirname(destZipPath);
    // unzip
    yield decompress(filePath, dirPath);
    this.folderPath = dirPath;
    return dirPath;
  }
}

module.exports = Util;
