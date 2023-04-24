const blockQuoteUtils = require("../../src/utils/blockQuoteUtils");


test.each([
  ['\n> \n> \n> \n> ', '\n> \n> '],
  ['\n> \n> \n> ', '\n> \n> '],
  ['\n> \n> ', '\n> \n> '],
  ['\n> ', '\n> '],
  ['', ''],
  ['something', 'something'],
  ['\n> hello\n> world', '\n> hello\n> world'],
  ['\n> hello\n> \n> world', '\n> hello\n> \n> world'],
  ['\n> hello\n> \n> \n> \n> world', '\n> hello\n> \n> world'],
  ['\n> hello\n> \n> \n> \n> \n> \n> world', '\n> hello\n> \n> world'],
])('%s => %s', (input, expected) => {
  const qhRemoved = blockQuoteUtils.removeRedundantQuoteHeads(input);
  expect(qhRemoved).toEqual(expected);
});
