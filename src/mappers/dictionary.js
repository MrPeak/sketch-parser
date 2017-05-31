'use strict';

module.exports = {
  props: {
    _class: '<class>',
    do_objectID: 'objectID',
    MSAttributedStringFontAttribute: 'NSFont',
  },

  booleanValues: {
    false: 0,
    true: 1,
  },

  values: {
    symbolMaster: 'MSSymbolMaster',
    symbolInstance: 'MSSymbolInstance',
    symbolContainer: 'MSSymbolContainer',
    document: 'MSDocumentData',
    page: 'MSPage',
    artboard: 'MSArtboardGroup',
    group: 'MSLayerGroup',
    text: 'MSTextLayer',
    rect: 'MSRect',
    oval: 'MSOvalShape',
    shapePath: 'MSShapePath',
    path: 'MSShapePath',
    bitmap: 'MSBitmapLayer',
    rectangle: 'MSRectangleShape',
    curvePoint: 'MSCurvePoint',
    exportOptions: 'MSExportOptions',
    exportFormat: 'MSExportFormat',
    assetCollection: 'MSAssetCollection',
    imageCollection: 'MSImageCollection',
    sharedTextStyleContainer: 'MSSharedTextStyleContainer',
    sharedStyle: 'MSSharedStyle',
    graphicsContextSettings: 'MSGraphicsContextSettings',
    color: 'NSColor',
    rulerData: 'MSRulerData',
    textStyle: 'MSTextStyle',
    sharedStyleContainer: 'MSSharedStyleContainer',
    style: 'MSStyle',
    blur: 'MSStyleBlur',
    borderOptions: 'MSStyleBorderOptions',
    colorControls: 'MSStyleColorControls',
    shadow: 'MSStyleShadow',
    innerShadow: 'MSStyleInnerShadow',
    fill: 'MSStyleFill',
    gradient: 'MSGradient',
    gradientStop: 'MSGradientStop',
    MSAttributedString: 'NSConcreteAttributedString',
  },
};

// MSImageData🤡
// MSStyleReflection🤡

// "image" : {
//   "<class>" : "MSImageData",
//   "size" : "{1280, 851}",
//   "sha1" : "<135e5459 75d81eba c482823e 9bec6bcc 4e1bf423>"
// },

// "image": {
//     "_class": "MSJSONFileReference",
//     "_ref_class": "MSImageData",
//     "_ref": "images\/e607a3e5caf014ff210d1af02a2a2e9aae283ba7"
// },

// "attributedString" : {
//   "<class>" : "NSConcreteAttributedString",
//   "value" : {
//     "<class>" : "NSConcreteAttributedString",
//     "text" : "Type something",
//     "attributes" : [
//       {
//         "NSColor" : {
//           "<class>" : "NSColor",
//           "color" : "rgba(0.645918,0.177316,0.805936,1.000000)"
//         },
//         "NSParagraphStyle" : {
//           "<class>" : "NSParagraphStyle",
//           "style" : {
//             "headerLevel" : 0,
//             "paragraphSpacing" : 0,
//             "tabStops" : [
//               28,
//               56,
//               84,
//               112,
//               140,
//               168,
//               196,
//               224,
//               252,
//               280,
//               308,
//               336
//             ],
//             "headIndent" : 0,
//             "lineBreakMode" : 0,
//             "hyphenationFactor" : 0,
//             "alignment" : 1,
//             "paragraphSpacingBefore" : 0,
//             "tailIndent" : 0,
//             "firstLineHeadIndent" : 0,
//             "minimumLineHeight" : 0,
//             "lineSpacing" : 0,
//             "maximumLineHeight" : 0,
//             "lineHeightMultiple" : 0,
//             "baseWritingDirection" : -1,
//             "defaultTabInterval" : 0
//           }
//         },
//         "length" : 14,
//         "NSFont" : {
//           "name" : "系统字体",
//           "attributes" : {
//             "NSCTFontUIUsageAttribute" : "CTFontRegularUsage",
//             "NSFontSizeAttribute" : 12
//           },
//           "family" : ".SF NS Text"
//         },
//         "location" : 0,
//         "text" : "Type something"
//       }
//     ]
//   }
// }
