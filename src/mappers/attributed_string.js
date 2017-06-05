'use strict';

const bplist2JSON = require('../decode_bqlist');

function lowerFirstLetter(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

module.exports = function*(originObj) {
  // <class>: "NSConcreteAttributedString",
  // archivedAttributedString: {
  // _archive:

  if (!originObj.archivedAttributedString) {
    return originObj;
  }

  if (originObj._class && originObj._class.toLowerCase() !== 'msattributedstring') {
    return originObj;
  }

  const archiveStr = originObj.archivedAttributedString._archive;

  delete originObj.archivedAttributedString;

  const plistCollection = yield bplist2JSON(archiveStr);
  const dataObj = {
    '<class>': 'NSConcreteAttributedString',
    text: '',
    attributes: [],
  };

  for (const el of plistCollection) {
    const objs = el['$objects'];
    // const rootIndex = el['$top'].root;
    // const firstEl = objs[rootIndex];
    const tmp = {};

    objs.forEach(obj => {
      if (obj && obj['$class']) {
        const classDefinition = objs[obj['$class']];
        const className = classDefinition['$classname'];

        if (className.toLowerCase().indexOf('nsdictionary') > -1) {
          // set attrs
          obj['NS.keys'].forEach((key, i) => {
            tmp[objs[key]] = objs[obj['NS.objects'][i]];
          });

          for (const key in tmp) {
            if (key === 'NSColor') {
              // set color
              const backup = tmp[key];
              tmp[key] = {
                '<class>': 'NSColor',
              };

              const rgbaArr = backup.NSRGB
                .toString('utf8')
                .replace('\u0000', '')
                .split(' ');

              if (rgbaArr.length === 3) {
                // rgb fix
                rgbaArr.push(1);
              }

              tmp[key].color = `rgba(${rgbaArr.join(', ')})`;

              return;
            }

            if (key === 'NSParagraphStyle') {
              // set paragraph
              const backup = tmp[key];
              tmp[key] = {
                '<class>': 'NSParagraphStyle',
                style: {},
              };

              Object.keys(backup).forEach(_key => {
                if (_key === '$class') {
                  return false;
                }

                const value = backup[_key];

                if (_key === 'NSMinLineHeight') {
                  tmp[key].style['minimumLineHeight'] = value;
                } else if (_key === 'NSMaxLineHeight') {
                  tmp[key].style['maximumLineHeight'] = value;
                } else {
                  _key = _key.replace('NS', '');
                  tmp[key].style[lowerFirstLetter(_key)] = value;
                }
              });
            }

            if (key === 'MSAttributedStringFontAttribute') {
              // set font

              const backup = tmp[key];

              tmp[key] = {
                name: '',
                family: '',
                attributes: {},
              };

              const contentObj = objs[backup.NSFontDescriptorAttributes];
              const attrKeyIndexList = contentObj['NS.keys'];
              const attrValueIndexList = contentObj['NS.objects'];

              attrKeyIndexList.forEach((_i, index) => {
                tmp[key].attributes[objs[_i]] = objs[attrValueIndexList[index]];
              });
            }
          }
        }

        if (
          obj['NSString'] &&
          className.toLowerCase().indexOf('attributedstring') > -1
        ) {
          // set text
          tmp.text = objs[obj['NSString']];
        }
      }
    });

    dataObj.attributes.push(tmp);
    dataObj.text += tmp.text;
  }

  originObj.value = dataObj;

  return originObj;
};
