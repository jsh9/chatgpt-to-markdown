/*
This file is adapted from: https://github.com/ryanschiang/chatgpt-export/blob/b5edd91ff21c07653570d57f06370ea6cdb4ef9f/src/exportMarkdown.js

The original code repository has MIT license. Below is the original license:

Copyright 2023 Ryan Chiang

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

const consoleSave = require("./utils/consoleSave");
const parseElements = require("./utils/parseElements");


(function chatGptToMarkdown() {
  const elements = document.querySelectorAll("[class*='min-h-[20px]']");
  const markdown = parseElements(elements);

  if (typeof markdown === "string" && markdown.length > 0) {
    consoleSave(console, "md");
    console.save(markdown);
  }

  return markdown;
})();
