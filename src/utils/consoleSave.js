/*
This file is copied from: https://github.com/ryanschiang/chatgpt-export/blob/b5edd91ff21c07653570d57f06370ea6cdb4ef9f/src/util/consoleSave.js

The original code repository has MIT license. Below is the original license:

Copyright 2023 Ryan Chiang

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

module.exports = function (console, fileType) {
  console.save = function (data) {
    let mimeType = 'text/plain';

    const title = document.getElementsByTagName('title')[0].innerText;
    let filename = title
      ? title
          .trim()
          .replace(/["]/g, "'")  // replace double quote with single quote
          .replace(/[\\/:*?"<>|]/g, '-')  // replace non-filename-elegible symbols with "-"
          .replace(/\.$/, '')  // remove dot at the end
      : 'chatGPT';
    if (fileType.toLowerCase() === 'json') {
      filename += '.json';
      mimeType = 'text/json';

      if (typeof data === 'object') {
        data = JSON.stringify(data, undefined, 4);
      }
    } else if (fileType.toLowerCase() === 'md') {
      filename += '.md';
    }

    var blob = new Blob([data], { type: mimeType });
    var a = document.createElement('a');

    a.download = filename;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = [mimeType, a.download, a.href].join(':');
    var e = new MouseEvent('click', {
      canBubble: true,
      cancelable: false,
      view: window,
      detail: 0,
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      metaKey: false,
      button: 0,
      relatedTarget: null,
    });

    a.dispatchEvent(e);
  };
};
