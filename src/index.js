'use strict';

/**
 * Common util methods
 */

// Built-in
const os = require('os');
const path = require('path');
const assert = require('assert');
const exec = require('child_process').exec;

// Third-party
const uid2 = require('uid2');
const flattenTree = require('tree-flatter');
const fs = require('fs-extra');
const decompress = require('decompress');
const traverse = require('traverse');

// Customized
const textStyle = require('./mappers/text_style');
const dictionary = require('./mappers/dictionary');
const zipColor = require('./mappers/color');
const unzip = require('./mappers/unzip');

/**
 * Parser class
 *
 * @class Parser
 */
class Parser {
  /**
   * Creates an instance of Parser.
   *
   * @param {string} sketchFile - SketchApp's absolute file path
   * @param {boolean} needSketchTool - whether the platform is MacOSX or not.
   *
   * @memberof Parser
   */
  constructor(sketchFile, needSketchTool) {
    assert(
      path.isAbsolute(sketchFile),
      'SketchApp file\'s path must be absolute, plz check.'
    );

    this.needSketchTool = needSketchTool === false ? false : true;
    this.filePath = sketchFile;
    this.folderPath = null;
    // Parsing JSOn files in the zip bundle is recommended.
    this.isOSX = os.type().toLowerCase() === 'darwin';
    this.useSketchTool = this.needSketchTool && this.isOSX;
  }

  set needSketchTool(val) {
    this._needSketchTool = val;
    this.useSketchTool = this._needSketchTool && this.isOSX;
  }

  get needSketchTool() {
    return this._needSketchTool;
  }

  /**
   *
   * @param {string} cmd - command
   * @return {Promise} Execute promise
   *
   * @memberof Parser
   * @private
   */
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

  /**
   *
   * @param {Object} obj - js object
   * @return {Object} Mapped js object
   *
   * @memberof Parser
   * @private
   */
  _mapDictionary(obj) {
    let str = JSON.stringify(obj);

    for (const key in dictionary.props) {
      // map prop
      str = str.replace(
        new RegExp(`"${key}":`, 'g'),
        `"${dictionary.props[key]}":`
      );
    }

    for (const key in dictionary.values) {
      // map value
      str = str.replace(
        new RegExp(`:"${key}"`, 'g'),
        `:"${dictionary.values[key]}"`
      );
    }

    for (const key in dictionary.booleanValues) {
      // map boolean value
      str = str.replace(
        new RegExp(`:${key}`, 'g'),
        `:${dictionary.booleanValues[key]}`
      );
    }

    return JSON.parse(str);
  }

  /**
   *
   *
   * @param {Object} pageData - page data of document
   *
   * @memberof Parser
   * @private
   *
   */
  *_traverse(pageData) {
    const tmpMap = new Map();
    // text style transform
    traverse(pageData).map(function(x) {
      // textStyle
      if (
        x.encodedAttributes &&
        x._class &&
        x._class.toLowerCase() === 'textstyle'
      ) {
        tmpMap.set(this.path, x);
        return false;
      }

      // unzip
      if (this.isLeaf) {
        tmpMap.set(this.path, unzip(x));
      }

      // zip color
      if (x._class && x._class.toLowerCase() === 'color') {
        tmpMap.set(this.path, zipColor(x));
      }
    });

    for (let [key, value] of tmpMap) {
      // tranform data
      value = yield textStyle(value);
      traverse(pageData).set(key, value);
      // debugger;
    }
  }

  /**
   * unzip `.sketch` file
   *
   * @return {string} dirPath unzip output path
   *
   * @memberof Parser
   * @private
   */
  *_extraFile() {
    if (this.folderPath) return this.folderPath;
    const filePath = this.filePath;
    const destZipPath = `./.fileCache/${uid2(8)}${path.basename(filePath)}`;
    // unzip
    yield decompress(filePath, destZipPath);
    this.folderPath = destZipPath;
    return destZipPath;
  }

  /**
   * Get meta info of the document
   *
   * @return {Object} meta
   *
   * @memberof Parser
   */
  *getMeta() {
    let meta = null;

    if (this.useSketchTool) {
      // Mac OSX platform
      meta = JSON.parse(
        yield this._exec(`sketchtool metadata ${this.filePath}`)
      );
    } else {
      const folderPath = yield this._extraFile();
      const metaPath = path.join(folderPath, 'meta.json');
      meta = yield fs.readJson(metaPath);
    }

    return meta; // The metaData of two ways are the same, there's no need to kake it unanimous.
  }

  /**
   * Get page obj list of the document
   *
   * @param {boolean} needMapper - Whether needing map name or not.
   * @return {Array} pageList
   *
   * @memberof Parser
   */
  *getPageDataList(needMapper) {
    if (this.pageDataList) return this.pageDataList;
    needMapper = needMapper === false ? false : true;

    let pageDataList = [];

    if (this.useSketchTool) {
      // Mac OSX platform
      const documentData = JSON.parse(
        yield this._exec(`sketchtool dump ${this.filePath}`)
      );

      pageDataList = documentData.pages;
    } else {
      const folderPath = yield this._extraFile();
      const files = yield fs.readdir(path.join(folderPath, 'pages'));

      for (const _ref of files) {
        const pagePath = path.join(folderPath, 'pages', _ref);
        const pageData = yield fs.readJson(pagePath);

        yield this._traverse(pageData);

        pageDataList.push(pageData);
      }
    }

    // Default map
    if (needMapper) {
      pageDataList = this._mapDictionary(pageDataList);
      // page
    }

    this.pageDataList = pageDataList;
    return pageDataList;
  }

  /**
   * Get document data obj
   *
   * @return {Object} documentData
   *
   * @memberof Parser
   */
  *getDocumentData() {
    if (this.documentData) return this.documentData;

    let documentData = null;
    const filePath = this.filePath;

    if (this.useSketchTool) {
      // Mac OSX platform
      // Use the sketchtool first,
      // for file compatibility which was creadted/modified by Sketch App belowed version 43 🤑
      documentData = JSON.parse(
        yield this._exec(`sketchtool dump ${filePath}`)
      );
    } else {
      // Else platforms
      // Copy origin .sketch file and unzip it 🤡
      const folderPath = yield this._extraFile();
      // Extra success
      documentData = yield fs.readJson(path.join(folderPath, 'document.json')); // document structure
      // Read JSON success
      const pageList = yield this.getPageDataList(false);
      // Get page list success
      // Override ·document.pages·
      documentData.pages = pageList;
    }

    documentData = this._mapDictionary(documentData);
    this.documentData = documentData;
    return documentData;
  }

  *getFlatLayerList() {
    if (this.layerList) return this.layerList;

    const pageList = yield this.getPageDataList(false);
    let layerList = [];

    // Loops pages
    pageList.forEach(page => {
      // Collects all flatten layers
      const _layers = flattenTree(page, {
        idKey: 'objectID',
        itemsKey: 'layers',
      });

      layerList = layerList.concat(_layers);
    });

    this.layerList = layerList;

    return layerList;
  }
}

module.exports = Parser;
