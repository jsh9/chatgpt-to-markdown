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

let headerHandledMessages = new WeakSet();

function resetHeaderHandledMessages() {
  headerHandledMessages = new WeakSet();
}

function getDatasetRole(node) {
  if (
    node &&
    node.dataset &&
    typeof node.dataset.messageAuthorRole === 'string'
  ) {
    const role = node.dataset.messageAuthorRole.toLowerCase();
    if (role === 'user' || role === 'assistant') {
      return role;
    }
  }

  return null;
}

function getMessageContainer(node) {
  if (!node || node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  if (getDatasetRole(node)) {
    return node;
  }

  if (typeof node.closest === 'function') {
    const ancestor = node.closest('[data-message-author-role]');
    if (ancestor) {
      return ancestor;
    }
  }

  return null;
}

function buildHeaderForRole(role) {
  if (role === 'user') {
    return getHorizontalRules() + `\n\n# _Question_\n\n`;
  }

  if (role === 'assistant') {
    return `\n\n# _Answer_\n\n`;
  }

  return '';
}

function maybeAddMessageHeading(node) {
  if (!node || node.nodeType !== Node.ELEMENT_NODE) {
    return '';
  }

  const datasetRole = getDatasetRole(node);
  if (datasetRole) {
    if (!headerHandledMessages.has(node)) {
      const header = buildHeaderForRole(datasetRole);
      if (header) {
        headerHandledMessages.add(node);
        return header;
      }
    }
    return '';
  }

  const className = typeof node.className === 'string' ? node.className : '';
  let roleFromClass = null;

  if (className === 'empty:hidden') {
    roleFromClass = 'user';
  } else if (className.includes('markdown prose')) {
    roleFromClass = 'assistant';
  }

  if (!roleFromClass) {
    return '';
  }

  const container = getMessageContainer(node) || node;
  if (headerHandledMessages.has(container)) {
    return '';
  }

  const header = buildHeaderForRole(roleFromClass);
  if (header) {
    headerHandledMessages.add(container);
  }

  return header;
}

function parseNode(node, level) {
  var nodeMarkdown = '';

  if (node.nodeType === Node.ELEMENT_NODE) {
    nodeMarkdown += maybeAddMessageHeading(node);
    const childNodes = node.childNodes;

    if (node.tagName === 'OL') {
      nodeMarkdown += parseOrderedList(node, level);
    } else if (node.tagName === 'UL') {
      nodeMarkdown += parseUnorderedList(node, level);
    } else if (['P', 'LI', 'DIV'].includes(node.tagName)) {
      for (var j = 0; j < childNodes.length; j++) {
        const childNode = childNodes[j];

        if (childNode.nodeType == Node.TEXT_NODE) {
          const textContent = childNode.textContent;

          if (typeof textContent === 'string') {
            const hasNewline = /\r?\n/.test(textContent);

            if (!hasNewline) {
              let normalized = textContent.replace(/\u00a0/g, ' ');
              const hasLeadingSpace = /^\s/.test(normalized);
              const hasTrailingSpace = /\s$/.test(normalized);
              normalized = normalized.trim();

              if (normalized.length === 0) {
                continue;
              }

              if (hasLeadingSpace) {
                normalized = ' ' + normalized;
              }

              if (hasTrailingSpace) {
                normalized = normalized + ' ';
              }

              nodeMarkdown += normalized;
              continue;
            }

            const normalizedLines = textContent
              .replace(/\u00a0/g, ' ')
              .split(/\r?\n/)
              .map((line) => line.trim());

            const joined = normalizedLines.join('\n').trim();

            if (joined.length > 0) {
              nodeMarkdown += joined;
            }
          }
        }

        if (childNode.nodeType === Node.ELEMENT_NODE) {
          const tag = childNode.tagName;
          let handled = false;

          if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(tag)) {
            nodeMarkdown += parseHeader(childNode, tag);
            handled = true;
          }
          if (
            [
              'P',
              'LI',
              'STRONG',
              'EM',
              'DEL',
              'SPAN',
              'B',
              'I',
              'U',
              'S',
            ].includes(tag)
          ) {
            nodeMarkdown += parseParagraph(childNode);
            handled = true;
          }
          if (tag === 'SUB' || tag === 'SUP') {
            nodeMarkdown += childNode.outerHTML;
            handled = true;
          }
          if (tag === 'TIME') {
            handled = true;
            continue;
          }
          if (tag === 'BLOCKQUOTE') {
            nodeMarkdown += parseBlockQuote(childNode, level);
            handled = true;
          }
          if (tag === 'OL') {
            nodeMarkdown += parseOrderedList(childNode, level);
            handled = true;
          }
          if (tag === 'UL') {
            nodeMarkdown += parseUnorderedList(childNode, level);
            handled = true;
          }
          if (tag === 'PRE') {
            nodeMarkdown += parseCodeBlock(childNode);
            handled = true;
          }
          if (tag === 'TABLE') {
            nodeMarkdown += parseTable(childNode);
            handled = true;
          }
          if (tag === 'CODE') {
            nodeMarkdown += parseInlineCode(childNode);
            handled = true;
          }
          if (tag === 'HR') {
            nodeMarkdown += getHorizontalRules();
            handled = true;
          }

          if (!handled) {
            nodeMarkdown += parseNode(childNode, level);
          }

          if (
            ![
              'CODE',
              'STRONG',
              'EM',
              'DEL',
              'SPAN',
              'SUB',
              'SUP',
              'B',
              'I',
              'U',
              'S',
            ].includes(tag)
          ) {
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

function stripWrappingFormatting(text) {
  let result = text.trim();
  let changed = true;
  const wrappers = [
    ['**', '**'],
    ['__', '__'],
    ['*', '*'],
    ['_', '_'],
  ];

  while (changed) {
    changed = false;
    for (const [start, end] of wrappers) {
      if (
        result.startsWith(start) &&
        result.endsWith(end) &&
        result.length > start.length + end.length
      ) {
        result = result.slice(start.length, result.length - end.length).trim();
        changed = true;
      }
    }
  }

  return result;
}

function parseHeader(node, tag) {
  var headerLevel = parseInt(tag.charAt(tag.length - 1), 10);
  var pounds = generatePounds(headerLevel);
  var content = replaceString(node.outerHTML);
  content = stripWrappingFormatting(content);
  if (headerLevel >= 2) {
    content = removeBoldFormatting(content);
  }
  return pounds + ' ' + content;
}

function removeBoldFormatting(text) {
  let previous = null;
  let result = text;

  while (previous !== result) {
    previous = result;
    result = result.replace(/\*\*(.*?)\*\*/g, '$1');
  }

  previous = null;
  while (previous !== result) {
    previous = result;
    result = result.replace(/__(.*?)__/g, '$1');
  }

  return result;
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
  const rawCode = splitContents[1].trimEnd();

  const codeLines = rawCode.split('\n');
  let minIndent = Infinity;

  for (const line of codeLines) {
    const trimmed = line.trim();
    if (trimmed.length === 0) {
      continue;
    }
    const leadingSpaces = line.match(/^\s*/)[0].length;
    if (leadingSpaces < minIndent) {
      minIndent = leadingSpaces;
    }
  }

  if (!isFinite(minIndent)) {
    minIndent = 0;
  }

  const dedentedLines =
    minIndent > 0
      ? codeLines.map((line) => line.slice(Math.min(minIndent, line.length)))
      : codeLines;

  const positiveIndents = dedentedLines
    .map((line) => line.match(/^\s*/)[0].length)
    .filter((indent) => indent > 0);

  let scaledLines = dedentedLines;

  if (positiveIndents.length > 0) {
    const baseIndent = Math.min(...positiveIndents);

    if (baseIndent > 4 && baseIndent % 4 === 0) {
      const scale = baseIndent / 4;
      scaledLines = dedentedLines.map((line) => {
        const match = line.match(/^(\s*)(.*)$/);
        const spaces = match[1].length;

        if (spaces === 0) {
          return match[2];
        }

        const normalizedSpaces = ' '.repeat(Math.round(spaces / scale));
        return normalizedSpaces + match[2];
      });
    }
  }

  const adjustedLines = scaledLines.map((line) => {
    const match = line.match(/^(\s*)(.*)$/);
    const content = match[2];

    if (/^[-*>]/.test(content)) {
      return content;
    }

    return line;
  });

  const normalizedCode = adjustedLines.join('\n');

  return `\`\`\`${language}\n${normalizedCode}\n\`\`\`\n`;
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
module.exports.resetHeaderHandledMessages = resetHeaderHandledMessages;
