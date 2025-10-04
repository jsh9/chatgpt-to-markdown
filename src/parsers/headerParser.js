const getHorizontalRules = require('../utils/getHorizontalRules');
const {
  getDatasetRole,
  getMessageContainer,
  getRoleFromClassName,
} = require('./elementDetector');

let headerHandledMessages = new WeakSet();

function resetHeaderHandledMessages() {
  headerHandledMessages = new WeakSet();
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

  const roleFromClass = getRoleFromClassName(node);

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

function parseHeader(node, tag, replaceString) {
  var headerLevel = parseInt(tag.charAt(tag.length - 1), 10);
  var pounds = generatePounds(headerLevel);
  var content = replaceString(node.outerHTML);
  content = stripWrappingFormatting(content);
  if (headerLevel >= 2) {
    content = removeBoldFormatting(content);
  }
  return pounds + ' ' + content;
}

module.exports = {
  resetHeaderHandledMessages,
  maybeAddMessageHeading,
  parseHeader,
};
