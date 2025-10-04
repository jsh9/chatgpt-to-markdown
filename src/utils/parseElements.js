const parseNode = require('./parseNode');
const cleanUpString = require('./cleanUpString');
const { hasMessageAuthorRole } = require('../parsers/elementDetector');
const { resetHeaderHandledMessages } = require('../parsers/headerParser');

function parseElements(elements) {
  var markdown = '';
  const level = 0;

  resetHeaderHandledMessages();

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
