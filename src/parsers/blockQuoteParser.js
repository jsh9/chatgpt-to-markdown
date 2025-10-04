const blockQuoteUtils = require('../utils/blockQuoteUtils');

function getSpaces(level) {
  const numSpaces = level * 3;
  return ' '.repeat(numSpaces);
}

function parseBlockQuote(node, level, parseNodeFn) {
  var blockQuoteMarkdown = '\n';
  const spaces = getSpaces(level);
  const quoteHead = blockQuoteUtils.makeQuoteHead(spaces);
  const childNodes = node.childNodes;

  for (var i = 0; i < childNodes.length; i++) {
    const blockQuoteNode = childNodes[i];
    if (blockQuoteNode.tagName === 'BLOCKQUOTE') {
      blockQuoteMarkdown += parseBlockQuote(blockQuoteNode, level, parseNodeFn);
    } else {
      blockQuoteMarkdown +=
        '\n' + parseNodeFn(blockQuoteNode, level + 1) + '\n';
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

module.exports = {
  parseBlockQuote,
};
