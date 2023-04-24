const parseNode = require('./parseNode');
const cleanUpString = require('./cleanUpString');

function parseElements(elements) {
  var markdown = '';
  const level = 0;

  for (var i = 0; i < elements.length; i++) {
    const ele = elements[i];

    const firstChild = ele.firstChild;
    if (!firstChild) {
      continue;
    }
    markdown += parseNode(firstChild, level);
  }

  return cleanUpString(markdown);
}

module.exports = parseElements;
