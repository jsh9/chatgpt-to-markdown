function replaceQuoteHeadFromEnd(inputString) {
  const quoteHead = "\n> ";
  if (inputString.endsWith(quoteHead)) {
    return inputString.slice(0, -quoteHead.length) + "\n";
  } else {
    return inputString;
  }
}


function makeQuoteHead(spaces) {
  return "\n" + spaces + "> ";
}


function trimAndAddPaddingNewlines(str) {
  return str.trim() + "\n";
}


function removeRedundantQuoteHeads(str) {
  // Replace 3+ consecutive "\n>" with only 2 "\n>"
  const replaced = str.replaceAll(/(\n> ){3,}/g, "\n> \n> ");
  return replaced;
}


module.exports = {
  replaceQuoteHeadFromEnd: replaceQuoteHeadFromEnd,
  makeQuoteHead: makeQuoteHead,
  trimAndAddPaddingNewlines: trimAndAddPaddingNewlines,
  removeRedundantQuoteHeads: removeRedundantQuoteHeads,
};
