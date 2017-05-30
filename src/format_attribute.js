// textStyle

'use strict';
const bplist2JSON = require('./decode_bqlist_base64');

function lowerFirstLetter(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

/**
 * @param {Object} node - node tree
 * @return {Object} formated node tree
 */
module.exports = function*(node) {
  if (!node.encodedAttributes || node._class.toLowerCase() !== 'textstyle') {
    return node;
  }

  const tempAttrObj = node.encodedAttributes;
  delete node.encodedAttributes; // Delete useless attributes

  // Decode attributes
  for (const prop in tempAttrObj) {
    const archiveStr = tempAttrObj[prop]._archive;
    if (!archiveStr) continue; // No need to decode

    const decodedArray = yield bplist2JSON(archiveStr);
    const topIndex = decodedArray[0]['$top'].root;
    const objects = decodedArray[0]['$objects'];
    const tempObj = {};

    if (prop === 'MSAttributedStringFontAttribute' || prop === 'NSFont') {
      // ==== font style ===
      tempObj.name = '';
      tempObj.family = '';
      tempObj.attributes = {};

      const contentIndex = objects[topIndex].NSFontDescriptorAttributes;
      const contentObj = objects[contentIndex];
      const attrKeyIndexList = contentObj['NS.keys'];
      const attrValueIndexList = contentObj['NS.objects'];

      attrKeyIndexList.forEach((_i, index) => {
        tempObj.attributes[objects[_i]] = objects[attrValueIndexList[index]];
      });

      // [
      //   {
      //     "$version": 100000,
      //     "$objects": [
      //       "$null",
      //       {
      //         "$class": 8,
      //         "NSFontDescriptorAttributes": 2
      //       },
      //       {
      //         "NS.keys": [
      //           3,
      //           4
      //         ],
      //         "NS.objects": [
      //           5,
      //           6
      //         ],
      //         "$class": 7
      //       },
      //       "NSFontSizeAttribute",
      //       "NSFontNameAttribute",
      //       12,
      //       "AvenirNext-Regular",
      //       {
      //         "$classname": "NSMutableDictionary",
      //         "$classes": [
      //           "NSMutableDictionary",
      //           "NSDictionary",
      //           "NSObject"
      //         ]
      //       },
      //       {
      //         "$classname": "NSFontDescriptor",
      //         "$classes": [
      //           "NSFontDescriptor",
      //           "NSObject"
      //         ]
      //       }
      //     ],
      //     "$archiver": "NSKeyedArchiver",
      //     "$top": {
      //       "root": 1
      //     }
      //   }
      // ]
    }

    if (prop === 'NSColor') {
      const NSRGB = objects[topIndex].NSRGB;
      tempObj['<class>'] = 'NSColor';
      const rgbaArr = NSRGB.toString('utf8').replace('\u0000', '').split(' ');

      if (rgbaArr.length === 3) {
        // rgb fix
        rgbaArr.push(1);
      }

      tempObj.color = `rgba(${rgbaArr.join(', ')})`;

      // console.log(JSON.stringify(tempObj));

      // color style
      // [
      //   {
      //     "$version": 100000,
      //     "$objects": [
      //       "$null",
      //       {
      //         "NSRGB": {
      //           "type": "Buffer",
      //           "data": [49,32,49,32,49,0]
      //         },
      //         "NSColorSpace": 1,
      //         "$class": 2
      //       },
      //       {
      //         "$classname": "NSColor",
      //         "$classes": [
      //           "NSColor",
      //           "NSObject"
      //         ]
      //       }
      //     ],
      //     "$archiver": "NSKeyedArchiver",
      //     "$top": {
      //       "root": 1
      //     }
      //   }
      // ]
    }

    if (prop === 'NSParagraphStyle') {
      // paragraph style
      tempObj['<class>'] = 'NSParagraphStyle';
      tempObj.style = {};

      const attrObj = objects[topIndex];

      Object.keys(attrObj).forEach(key => {
        if (key === '$class') {
          return false;
        }

        const value = attrObj[key];

        if (key === 'NSMinLineHeight') {
          tempObj.style['minimumLineHeight'] = value;
        } else if (key === 'NSMaxLineHeight') {
          tempObj.style['maximumLineHeight'] = value;
        } else {
          key = key.replace('NS', '');
          tempObj.style[lowerFirstLetter(key)] = value;
        }
      });

      // [
      //   {
      //     "$version": 100000,
      //     "$objects": [
      //       "$null",
      //       {
      //         "NSAlignment": 4,
      //         "NSTabStops": 0,
      //         "NSMinLineHeight": 15,
      //         "$class": 2,
      //         "NSMaxLineHeight": 15
      //       },
      //       {
      //         "$classname": "NSMutableParagraphStyle",
      //         "$classes": [
      //           "NSMutableParagraphStyle",
      //           "NSParagraphStyle",
      //           "NSObject"
      //         ]
      //       }
      //     ],
      //     "$archiver": "NSKeyedArchiver",
      //     "$top": {
      //       "root": 1
      //     }
      //   }
      // ]
    }

    tempAttrObj[prop] = tempObj;
  }

  node = Object.assign({}, node, tempAttrObj);
  return node;
};
