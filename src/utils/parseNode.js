/*
A part of this file is adapted from: https://github.com/ryanschiang/chatgpt-export/blob/b5edd91ff21c07653570d57f06370ea6cdb4ef9f/src/exportMarkdown.js

The original code repository has MIT license. Below is the original license:

Copyright 2023 Ryan Chiang

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

const replaceString = require('./replaceString');
const getHorizontalRules = require('./getHorizontalRules');
const CONSTANTS = require('../constants');

// Import modular parsers
const {
  maybeAddMessageHeading,
  parseHeader,
} = require('../parsers/headerParser');
const {
  shouldIgnoreKatexSubtree,
  parseKatexNode,
} = require('../parsers/katexParser');
const {
  parseOrderedList,
  parseUnorderedList,
} = require('../parsers/listParser');
const { parseInlineCode, parseCodeBlock } = require('../parsers/codeParser');
const { parseTable } = require('../parsers/tableParser');
const { parseBlockQuote } = require('../parsers/blockQuoteParser');

function parseNode(node, level) {
  var nodeMarkdown = '';

  if (node.nodeType === Node.ELEMENT_NODE) {
    nodeMarkdown += maybeAddMessageHeading(node);

    if (node.tagName === 'OL') {
      nodeMarkdown += parseOrderedList(node, level, parseNode);
    } else if (node.tagName === 'UL') {
      nodeMarkdown += parseUnorderedList(node, level, parseNode);
    } else if (CONSTANTS.BLOCK_ELEMENTS.includes(node.tagName)) {
      nodeMarkdown += parseBlockElement(node, level);
    } else {
      throw new Error(
        `Edge case encountered: node.tagName: ${node.tagName}\n` +
          'Please contact the author.',
      );
    }
  }
  return nodeMarkdown;
}

function parseBlockElement(node, level) {
  let nodeMarkdown = '';
  const childNodes = node.childNodes;

  for (var j = 0; j < childNodes.length; j++) {
    const childNode = childNodes[j];

    if (childNode.nodeType == Node.TEXT_NODE) {
      nodeMarkdown += processTextNode(childNode);
    }

    if (childNode.nodeType === Node.ELEMENT_NODE) {
      nodeMarkdown += processElementNode(childNode, level);
    }
  }

  return nodeMarkdown;
}

function processTextNode(textNode) {
  const textContent = textNode.textContent;

  if (typeof textContent !== 'string') {
    return '';
  }

  const hasNewline = /\r?\n/.test(textContent);

  if (!hasNewline) {
    let normalized = textContent.replace(/\u00a0/g, ' ');
    const hasLeadingSpace = /^\s/.test(normalized);
    const hasTrailingSpace = /\s$/.test(normalized);
    normalized = normalized.trim();

    if (normalized.length === 0) {
      return '';
    }

    if (hasLeadingSpace) {
      normalized = ' ' + normalized;
    }

    if (hasTrailingSpace) {
      normalized = normalized + ' ';
    }

    return normalized;
  }

  const normalizedLines = textContent
    .replace(/\u00a0/g, ' ')
    .split(/\r?\n/)
    .map((line) => line.trim());

  const joined = normalizedLines.join('\n').trim();

  return joined.length > 0 ? joined : '';
}

function processElementNode(childNode, level) {
  const tag = childNode.tagName;
  let nodeMarkdown = '';
  let handled = false;

  // Handle KaTeX first
  if (shouldIgnoreKatexSubtree(childNode)) {
    return '';
  }

  const katexContent = parseKatexNode(childNode);
  if (katexContent) {
    nodeMarkdown += katexContent.markdown;
    if (katexContent.type === 'display') {
      nodeMarkdown += '\n\n';
    }
    return nodeMarkdown;
  }

  // Handle different element types
  if (CONSTANTS.HEADER_ELEMENTS.includes(tag)) {
    nodeMarkdown += parseHeader(childNode, tag, replaceString);
    handled = true;
  } else if (CONSTANTS.PARAGRAPH_ELEMENTS.includes(tag)) {
    nodeMarkdown += parseParagraph(childNode);
    handled = true;
  } else if (tag === 'SUB' || tag === 'SUP') {
    nodeMarkdown += childNode.outerHTML;
    handled = true;
  } else if (tag === 'TIME') {
    handled = true; // Skip TIME elements
  } else if (tag === 'BLOCKQUOTE') {
    nodeMarkdown += parseBlockQuote(childNode, level, parseNode);
    handled = true;
  } else if (tag === 'OL') {
    nodeMarkdown += parseOrderedList(childNode, level, parseNode);
    handled = true;
  } else if (tag === 'UL') {
    nodeMarkdown += parseUnorderedList(childNode, level, parseNode);
    handled = true;
  } else if (tag === 'PRE') {
    nodeMarkdown += parseCodeBlock(childNode);
    handled = true;
  } else if (tag === 'TABLE') {
    nodeMarkdown += parseTable(childNode, replaceString);
    handled = true;
  } else if (tag === 'CODE') {
    nodeMarkdown += parseInlineCode(childNode);
    handled = true;
  } else if (tag === 'HR') {
    nodeMarkdown += getHorizontalRules();
    handled = true;
  }

  if (!handled) {
    nodeMarkdown += parseNode(childNode, level);
  }

  // Add newlines for block elements
  if (!CONSTANTS.INLINE_ELEMENTS.includes(tag)) {
    nodeMarkdown += '\n\n';
  }

  return nodeMarkdown;
}

function parseParagraph(node) {
  return replaceString(node.outerHTML);
}

module.exports = parseNode;
