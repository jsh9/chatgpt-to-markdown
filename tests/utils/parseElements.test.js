const fs = require('fs');
const { JSDOM } = require('jsdom');
const parseElements = require('../../src/utils/parseElements');
const testCaseDir = './tests/utils/test_cases/';

// We are mocking Node because it's only available in the browser
global.Node = {
  ELEMENT_NODE: 1,
  TEXT_NODE: 3,
};


test('Test case: nested lists', () => {
  const inputHtml = fs.readFileSync(testCaseDir + 'nested_lists.html', 'utf8');
  const dom = new JSDOM(inputHtml);
  global.document = dom.window.document;
  const elements = dom.window.document.querySelectorAll(
    "[class*='min-h-[20px]']",
  );
  const parsedMd = parseElements(elements, 0);
  const expectedMd = fs.readFileSync(
    testCaseDir + 'nested_lists_expected.md',
    'utf8',
  );
  expect(parsedMd).toEqual(expectedMd);
});
