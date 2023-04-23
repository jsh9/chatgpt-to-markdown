const parseNode = require("./parseNode");
const getHorizontalRules = require("./getHorizontalRules");


function parseElements(elements) {
  var markdown = "";
  const level = 0;

  for (var i = 0; i < elements.length; i++) {
    const ele = elements[i];

    const firstChild = ele.firstChild;
    if (!firstChild) {
      continue;
    }
    markdown += parseNode(firstChild, level);
  }

  markdown = markdown.substring(getHorizontalRules().length);

  return markdown;
}


module.exports = parseElements;
