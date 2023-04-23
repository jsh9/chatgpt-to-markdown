const fs = require('fs');
const { JSDOM } = require('jsdom');
const parseElements = require('../../src/utils/parseElements');
const testCaseDir = './tests/utils/test_cases/';
const encoding = 'utf8';

// We are mocking Node because it's only available in the browser
global.Node = {
  ELEMENT_NODE: 1,
  TEXT_NODE: 3,
};


test.each([
  ['nested_lists.html', 'nested_lists.md'],
  ['bulleted_list.html', 'bulleted_list.md'],
  ['table_and_list.html', 'table_and_list.md'],
  ['different_text_styles.html', 'different_text_styles.md'],
  ['table_with_complex_cells.html', 'table_with_complex_cells.md'],
])('%s => %s', (htmlFileName, mdFileName) => {
  const inputHtml = fs.readFileSync(testCaseDir + htmlFileName, encoding);
  const dom = new JSDOM(inputHtml);
  global.document = dom.window.document;
  const elements = dom.window.document.querySelectorAll(
    "[class*='min-h-[20px]']",
  );
  const parsedMd = parseElements(elements, 0);
  const expectedMd = fs.readFileSync(testCaseDir + mdFileName, encoding);
  expect(parsedMd).toEqual(expectedMd);
});
