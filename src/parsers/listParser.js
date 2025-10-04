const CONSTANTS = require('../constants');

function getSpaces(level) {
  if (level === undefined) {
    throw new Error('Please pass in `level` to `getSpaces()`');
  }

  // Multiply the level by 3 to get the number of spaces
  // We use 3 instead of 2 or 4 here, because:
  //    * 2 only sufficient for adding a level for unordered list
  //      (for ordered list, we need at least 3)
  //    # 4 is too much because it sometimes creates a quoted code block
  const numSpaces = level * CONSTANTS.SPACES_PER_LEVEL;

  // Create a new string with the specified number of spaces
  return ' '.repeat(numSpaces);
}

function parseOrderedList(node, level, parseNodeFn) {
  var orderedListMarkdown = '\n';
  const spaces = getSpaces(level);
  const childNodes = node.childNodes;

  for (var i = 0; i < childNodes.length; i++) {
    const listItemNode = childNodes[i];

    if (
      listItemNode.nodeType === Node.ELEMENT_NODE &&
      listItemNode.tagName === 'LI'
    ) {
      orderedListMarkdown += `${spaces}${i + node.start}. ${parseNodeFn(
        listItemNode,
        level + 1,
      )}\n`;
    }
  }

  return orderedListMarkdown + '\n';
}

function parseUnorderedList(node, level, parseNodeFn) {
  var unorderedListMarkdown = '\n';
  const spaces = getSpaces(level);
  const childNodes = node.childNodes;

  for (var i = 0; i < childNodes.length; i++) {
    const listItemNode = childNodes[i];

    if (
      listItemNode.nodeType === Node.ELEMENT_NODE &&
      listItemNode.tagName === 'LI'
    ) {
      unorderedListMarkdown += `${spaces}- ${parseNodeFn(
        listItemNode,
        level + 1,
      )}\n`;
    }
  }

  return unorderedListMarkdown + '\n';
}

module.exports = {
  parseOrderedList,
  parseUnorderedList,
};
