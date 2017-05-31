# sketch-parser

Eliminate the differences in the output of the following two ways：

* run sketchtool
* unzip `.sketch` and read `.json`

![version](https://img.shields.io/npm/v/sketch-parser.svg)
![Node.js](https://img.shields.io/badge/node.js-%3E=_6.0-green.svg)
![Sketch.app document](https://img.shields.io/badge/sketchapp--document-43+-brightgreen.svg)
[![Build Status](https://api.travis-ci.org/MrPeak/sketch-parser.svg?branch=master)](https://travis-ci.org/travis-ci/travis-web)

## Class: Parser

### new Parser(filePath, [needSketchTool])

* filePath `<String>`
* [needSketchTool] `<Boolean>`

Creates a new Parser object.

And sets the **parser.filePath** property to the provided sketch file path, maybe sets the **parser.needSketchTool** property to the provided option.

### parser.needSketchTool

* needSketchTool `<Boolean>`

Whether or not need *sketchtool* to get data, the default value is `true`.

### parser.getDocumentData();

Returns a whole document's data.

### parser.getPageDataList();

Returns a list containing all the page data.

## license

MIT
