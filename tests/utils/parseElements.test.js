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
  ['plain_paragraphs.html', 'plain_paragraphs.md'],
  ['block_quotes_0.html', 'block_quotes_0.md'],
  ['block_quotes_1.html', 'block_quotes_1.md'],
  ['block_quotes_2.html', 'block_quotes_2.md'],
  ['block_quotes_3.html', 'block_quotes_3.md'],
  ['block_quotes_4.html', 'block_quotes_4.md'],
  ['block_quotes_5.html', 'block_quotes_5.md'],
  ['block_quotes_6.html', 'block_quotes_6.md'],
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
