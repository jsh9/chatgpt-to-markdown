/*
A part of this file is adapted from: https://github.com/ryanschiang/chatgpt-export/blob/b5edd91ff21c07653570d57f06370ea6cdb4ef9f/src/exportMarkdown.js

The original code repository has MIT license. Below is the original license:

Copyright 2023 Ryan Chiang

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

const replaceString = require('./replaceString');
const getHorizontalRules = require('./getHorizontalRules');
const blockQuoteUtils = require('./blockQuoteUtils');

function parseNode(node, level) {
  var nodeMarkdown = '';

  if (node.nodeType === Node.ELEMENT_NODE) {
    const childNodes = node.childNodes;

    if (node.className == 'empty:hidden') {
      nodeMarkdown += getHorizontalRules();
      nodeMarkdown += `\n\n## Question\n\n`;
    }

    if (node.className.includes('markdown prose')) {
      nodeMarkdown += `\n\n## Answer\n\n`;
    }

    if (node.tagName === 'OL') {
      nodeMarkdown += parseOrderedList(node, level);
    } else if (node.tagName === 'UL') {
      nodeMarkdown += parseUnorderedList(node, level);
    } else if (['P', 'LI', 'DIV'].includes(node.tagName)) {
      for (var j = 0; j < childNodes.length; j++) {
        const childNode = childNodes[j];

        if (childNode.nodeType == Node.TEXT_NODE) {
          nodeMarkdown += childNode.textContent;
        }

        if (childNode.nodeType === Node.ELEMENT_NODE) {
          const tag = childNode.tagName;

          if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(tag)) {
            nodeMarkdown += parseHeader(childNode, tag);
          }
          if (['P', 'LI', 'STRONG', 'EM', 'DEL'].includes(tag)) {
            nodeMarkdown += parseParagraph(childNode);
          }
          if (tag === 'BLOCKQUOTE') {
            nodeMarkdown += parseBlockQuote(childNode, level);
          }
          if (tag === 'OL') {
            nodeMarkdown += parseOrderedList(childNode, level);
          }
          if (tag === 'UL') {
            nodeMarkdown += parseUnorderedList(childNode, level);
          }
          if (tag === 'PRE') {
            nodeMarkdown += parseCodeBlock(childNode);
          }
          if (tag === 'TABLE') {
            nodeMarkdown += parseTable(childNode);
          }
          if (tag === 'CODE') {
            nodeMarkdown += parseInlineCode(childNode);
          }

          if (!['CODE', 'STRONG', 'EM', 'DEL'].includes(tag)) {
            nodeMarkdown += '\n\n';
          }
        }
      }
    } else {
      throw new Error(
        `Edge case encountered: node.tagName: ${node.tagName}\n` +
          'Please contact the author.',
      );
    }
  }
  return nodeMarkdown;
}

function parseParagraph(node) {
  return replaceString(node.outerHTML);
}

function parseHeader(node, tag) {
  var headerLevel = parseInt(tag.charAt(tag.length - 1), 10);
  var pounds = generatePounds(headerLevel);
  return pounds + ' ' + replaceString(node.outerHTML);
}

function generatePounds(count) {
  let pounds = '';
  for (let i = 0; i < count; i++) {
    pounds += '#';
  }
  return pounds;
}

function parseBlockQuote(node, level) {
  var blockQuoteMarkdown = '\n';
  const spaces = getSpaces(level);
  const quoteHead = blockQuoteUtils.makeQuoteHead(spaces);
  const childNodes = node.childNodes;

  for (var i = 0; i < childNodes.length; i++) {
    const blockQuoteNode = childNodes[i];
    if (blockQuoteNode.tagName === 'BLOCKQUOTE') {
      blockQuoteMarkdown += parseBlockQuote(blockQuoteNode, level);
    } else {
      blockQuoteMarkdown += '\n' + parseNode(blockQuoteNode, level + 1) + '\n';
    }
  }

  const withQuoteHead =
    quoteHead +
    blockQuoteUtils
      .trimAndAddPaddingNewlines(blockQuoteMarkdown)
      .replace(/\n/g, quoteHead);
  const qhReplaced = blockQuoteUtils.replaceQuoteHeadFromEnd(withQuoteHead);
  const qhRemoved = blockQuoteUtils.removeRedundantQuoteHeads(qhReplaced);
  return qhRemoved;
}

function parseOrderedList(node, level) {
  var orderedListMarkdown = '\n';
  const spaces = getSpaces(level);
  const childNodes = node.childNodes;

  for (var i = 0; i < childNodes.length; i++) {
    const listItemNode = childNodes[i];

    if (
      listItemNode.nodeType === Node.ELEMENT_NODE &&
      listItemNode.tagName === 'LI'
    ) {
      orderedListMarkdown += `${spaces}${i + node.start}. ${parseNode(
        listItemNode,
        level + 1,
      )}\n`;
    }
  }

  return orderedListMarkdown + '\n';
}

function parseUnorderedList(node, level) {
  var unorderedListMarkdown = '\n';
  const spaces = getSpaces(level);
  const childNodes = node.childNodes;

  for (var i = 0; i < childNodes.length; i++) {
    const listItemNode = childNodes[i];

    if (
      listItemNode.nodeType === Node.ELEMENT_NODE &&
      listItemNode.tagName === 'LI'
    ) {
      unorderedListMarkdown += `${spaces}- ${parseNode(
        listItemNode,
        level + 1,
      )}\n`;
    }
  }

  return unorderedListMarkdown + '\n';
}

function parseCodeBlock(node) {
  const splitContents = node.textContent.split('Copy code');
  const language = splitContents[0].trim();
  const code = splitContents[1].trim();

  return `\`\`\`${language}\n${code}\n\`\`\`\n`;
}

function parseInlineCode(node) {
  return '`' + node.textContent + '`';
}

function parseTable(node) {
  let tableMarkdown = '\n';
  node.childNodes.forEach((tableSectionNode) => {
    if (
      tableSectionNode.nodeType === Node.ELEMENT_NODE &&
      (tableSectionNode.tagName === 'THEAD' ||
        tableSectionNode.tagName === 'TBODY')
    ) {
      // Get table rows
      let tableRows = '';
      let tableColCount = 0;
      tableSectionNode.childNodes.forEach((tableRowNode) => {
        if (
          tableRowNode.nodeType === Node.ELEMENT_NODE &&
          tableRowNode.tagName === 'TR'
        ) {
          // Get table cells
          let tableCells = '';

          tableRowNode.childNodes.forEach((tableCellNode) => {
            if (
              tableCellNode.nodeType === Node.ELEMENT_NODE &&
              (tableCellNode.tagName === 'TD' || tableCellNode.tagName === 'TH')
            ) {
              tableCells += `| ${replaceString(tableCellNode.outerHTML)} `;
              if (tableSectionNode.tagName === 'THEAD') {
                tableColCount++;
              }
            }
          });
          tableRows += `${tableCells}|\n`;
        }
      });

      tableMarkdown += tableRows;

      if (tableSectionNode.tagName === 'THEAD') {
        const headerRowDivider = `| ${Array(tableColCount)
          .fill('---')
          .join(' | ')} |\n`;
        tableMarkdown += headerRowDivider;
      }
    }
  });

  return tableMarkdown;
}

function getSpaces(level) {
  if (level === undefined) {
    throw new Error('Please pass in `level` to `getSpaces()`');
  }

  // Multiply the level by 3 to get the number of spaces
  // We use 3 instead of 2 or 4 here, because:
  //    * 2 only sufficient for adding a level for unordered list
  //      (for ordered list, we need at least 3)
  //    # 4 is too much because it sometimes creates a quoted code block
  const numSpaces = level * 3;

  // Create a new string with the specified number of spaces
  return ' '.repeat(numSpaces);
}

module.exports = parseNode;
