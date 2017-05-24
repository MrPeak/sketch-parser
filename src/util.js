'use strict';

/**
 * Common util methods
 */

const os = require('os');
const path = require('path');
const assert = require('assert');
const fs = require('fs-extra');
const decompress = require('decompress');
const exec = require('mz/child_process').exec;

/**
 * Util class
 *
 * @class Util
 */
class Util {
  /**
   * Creates an instance of Util.
   * @param {string} sketchFile SketchApp's absolute file path
   *
   * @memberof Util
   */
  constructor(sketchFile) {
    assert(
      path.isAbsolute(sketchFile),
      'SketchApp file\'s path must be absolute, plz check.'
    );

    this.filePath = sketchFile;
    this.folderPath = null;
    this.isOSX = os.type().toLowerCase === 'darwin'; // Parsing JSOn files in the zip bundle is recommended.
  }

  /**
   * Get meta info of the document
   *
   * @return {Object} meta
   *
   * @memberof Util
   */
  *getMeta() {
    let meta = null;

    if (this.isOSX) {
      // Mac OSX platform
      meta = yield exec(`sketchtool metadata ${this.filePath}`);
    } else {
      const metaPath = path.join(this.filePath, 'meta.json');
      meta = yield fs.readJson(metaPath);
    }

    return meta;
  }

  /**
   * Get page obj list of the document
   *
   * @return {Array} pageList
   *
   * @memberof Util
   */
  *getPages() {
    let pageList = [];

    if (this.isOSX) {
      // Mac OSX platform
      let documentData = yield exec(`sketchtool dump ${this.filePath}`);
      documentData = JSON.parse(documentData);

      pageList = documentData.pages;
    } else {
      const folderPath = yield this.extraFile();
      const files = yield fs.readdir(folderPath);

      for (const _ref of files) {
        const pagePath = path.join(folderPath, _ref);
        const pageData = yield fs.readJson(pagePath);

        pageList.push(pageData);
      }
    }

    return pageList;
  }

  /**
   * Get document data obj
   *
   * @return {Object} documentData
   *
   * @memberof Util
   */
  *getDocument() {
    if (this.documentData) return this.documentData;

    let documentData = null;
    const filePath = this.filePath;

    if (this.isOSX) {
      // Mac OSX platform
      // Use the sketchtool first, for file compatibility which was creadted/modified by Sketch App belowed version 43 😤

      documentData = yield exec(`sketchtool dump ${filePath}`);
      documentData = JSON.parse(documentData);
    } else {
      // Else platforms
      // Copy origin .sketch file and unzip it 🤡
      const folderPath = yield this.extraFile();
      // Extra success
      documentData = yield fs.readJson(path.join(folderPath, 'document.json')); // document structure
      // Read JSON success
      const pageList = yield this.getPages();
      // Get page list success
      // Override ·document.pages·
      documentData.pages = pageList;
    }

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
    const files = yield decompress(filePath, dirPath);
    console.log(files);

    this.folderPath = dirPath;
    return dirPath;
  }
}

module.exports = Util;
