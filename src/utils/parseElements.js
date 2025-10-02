const parseNode = require('./parseNode');
const cleanUpString = require('./cleanUpString');

function hasMessageAuthorRole(element) {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }

  return (
    element.dataset !== undefined &&
    typeof element.dataset.messageAuthorRole === 'string' &&
    element.dataset.messageAuthorRole.length > 0
  );
}

function parseElements(elements) {
  var markdown = '';
  const level = 0;

  if (typeof parseNode.resetHeaderHandledMessages === 'function') {
    parseNode.resetHeaderHandledMessages();
  }

  for (var i = 0; i < elements.length; i++) {
    const ele = elements[i];
    let nodeToParse = ele;

    if (!hasMessageAuthorRole(nodeToParse)) {
      nodeToParse = ele.firstElementChild || ele.firstChild;
    }

    if (!nodeToParse) {
      continue;
    }

    markdown += parseNode(nodeToParse, level);
  }

  return cleanUpString(markdown);
}

module.exports = parseElements;
