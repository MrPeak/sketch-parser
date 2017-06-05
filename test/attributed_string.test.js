'use strict';

require('co-mocha');
const assert = require('assert');
// const bplist2JSON = require('../../src/decode_bqlist');
const attributedString = require('../src/mappers/attributed_string');

describe('Decode data', () => {
  it('Should return correct JSON object format.', function*() {
    const res = yield attributedString({
      '_class': 'MSAttributedString',
      archivedAttributedString: {
        _archive: 'YnBsaXN0MDDUAQIDBAUGWltYJHZlcnNpb25YJG9iamVjdHNZJGFyY2hpdmVyVCR0b3ASAAGGoK8QFwcIDxAeHyAhIisyNj4/QEFCRkpLUVRWVSRudWxs0wkKCwwNDlhOU1N0cmluZ1YkY2xhc3NcTlNBdHRyaWJ1dGVzgAKAFoADXxAtMjAwZyBncmFub2xhIGFuZCBvbmUgcGVhcgoxMDcgY2Fsb3JpZXMgZ2FpbmVk0xESChMYHVdOUy5rZXlzWk5TLm9iamVjdHOkFBUWF4AEgAWABoAHpBkaGxyACIAKgBKAE4AVXxAQTlNQYXJhZ3JhcGhTdHlsZV8QH01TQXR0cmlidXRlZFN0cmluZ0ZvbnRBdHRyaWJ1dGVWTlNLZXJuV05TQ29sb3LVIyQlCiYnKCkqKVtOU0FsaWdubWVudFpOU1RhYlN0b3BzXxAPTlNNaW5MaW5lSGVpZ2h0XxAPTlNNYXhMaW5lSGVpZ2h0EASAACNALgAAAAAAAIAJ0iwtLi9aJGNsYXNzbmFtZVgkY2xhc3Nlc18QF05TTXV0YWJsZVBhcmFncmFwaFN0eWxloy4wMV8QEE5TUGFyYWdyYXBoU3R5bGVYTlNPYmplY3TSCjM0NV8QGk5TRm9udERlc2NyaXB0b3JBdHRyaWJ1dGVzgBGAC9MREgo3Oj2iODmADIANojs8gA6AD4AQXxATTlNGb250U2l6ZUF0dHJpYnV0ZV8QE05TRm9udE5hbWVBdHRyaWJ1dGUjQCgAAAAAAABfEBJBdmVuaXJOZXh0LVJlZ3VsYXLSLC1DRF8QE05TTXV0YWJsZURpY3Rpb25hcnmjQ0UxXE5TRGljdGlvbmFyedIsLUdIXxAQTlNGb250RGVzY3JpcHRvcqJJMV8QEE5TRm9udERlc2NyaXB0b3IjAAAAAAAAAADTTE0KTk9QVU5TUkdCXE5TQ29sb3JTcGFjZUoxIDEgMSAwLjYAEAGAFNIsLVJTV05TQ29sb3KiUjHSLC1FVaJFMdIsLVdYXxASTlNBdHRyaWJ1dGVkU3RyaW5nolkxXxASTlNBdHRyaWJ1dGVkU3RyaW5nXxAPTlNLZXllZEFyY2hpdmVy0VxdVHJvb3SAAQAIABEAGgAjAC0AMgA3AFEAVwBeAGcAbgB7AH0AfwCBALEAuADAAMsA0ADSANQA1gDYAN0A3wDhAOMA5QDnAPoBHAEjASsBNgFCAU0BXwFxAXMBdQF+AYABhQGQAZkBswG3AcoB0wHYAfUB9wH5AgACAwIFAgcCCgIMAg4CEAImAjwCRQJaAl8CdQJ5AoYCiwKeAqECtAK9AsQCygLXAuIC5ALmAusC8wL2AvsC/gMDAxgDGwMwA0IDRQNKAAAAAAAAAgEAAAAAAAAAXgAAAAAAAAAAAAAAAAAAA0w=',
      },
    });

    assert.deepEqual(res, {
      _class: 'MSAttributedString',
      value: {
        '<class>': 'NSConcreteAttributedString',
        text: '200g granola and one pear\n107 calories gained',
        attributes: [
          {
            text: '200g granola and one pear\n107 calories gained',
            NSParagraphStyle: {
              '<class>': 'NSParagraphStyle',
              style: {
                alignment: 4,
                tabStops: 0,
                minimumLineHeight: 15,
                maximumLineHeight: 15,
              },
            },
            MSAttributedStringFontAttribute: {
              name: '',
              family: '',
              attributes: {
                NSFontSizeAttribute: 12,
                NSFontNameAttribute: 'AvenirNext-Regular',
              },
            },
            NSKern: 0,
            NSColor: {
              '<class>': 'NSColor',
              color: 'rgba(1, 1, 1, 0.6)',
            },
          },
        ],
      },
    });
  });
});
