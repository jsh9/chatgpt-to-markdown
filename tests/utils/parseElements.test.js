const fs = require('fs');
const { JSDOM } = require('jsdom');
const parseElements = require('../../src/utils/parseElements');

global.Node = {  // because `Node.***` and is used in parseNode.js
  ELEMENT_NODE: 1,
  TEXT_NODE: 3
};


test('Test case: nested lists', () => {
  const html = fs.readFileSync('./tests/utils/test_cases/nested_lists.html', 'utf8');
  const dom = new JSDOM(html); //, { runScripts: 'dangerously' });
  global.document = dom.window.document;

  const elements = dom.window.document.querySelectorAll(
    "[class*='min-h-[20px]']"
  );

  console.log(elements[1].textContent);

  console.log(parseElements(elements, 0));
  // expect(parseNode(htmlContent, 1)).toBe(2);
});
