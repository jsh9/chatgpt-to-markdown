/*
This file is adapted from: https://github.com/ryanschiang/chatgpt-export/blob/b5edd91ff21c07653570d57f06370ea6cdb4ef9f/src/exportMarkdown.js

The original code repository has MIT license. Below is the original license:

Copyright 2023 Ryan Chiang

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

const consoleSave = require("./utils/consoleSave");
const replaceString = require("./utils/replaceString");


(function chatGptToMarkdown() {
  var markdown = "";
  const elements = document.querySelectorAll("[class*='min-h-[20px]']");

  for (var i = 0; i < elements.length; i++) {
    const ele = elements[i];

    const firstChild = ele.firstChild;
    if (!firstChild) {
      continue;
    }
    markdown += parseNode(firstChild);
  }

  markdown = markdown.substring(getHorizontalRules().length);

  if (typeof markdown === "string" && markdown.length > 0) {
    consoleSave(console, "md");
    console.save(markdown);
  }

  return markdown;
})();


function parseNode(node) {
  var nodeMarkdown = "";

  if (node.nodeType === Node.TEXT_NODE) {
    nodeMarkdown += getHorizontalRules();
    nodeMarkdown += `## Question\n\n`;
    nodeMarkdown += node.textContent;
    nodeMarkdown += "\n\n";
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    const childNodes = node.childNodes;

    if (node.className.includes("markdown prose")) {
      nodeMarkdown += `## Answer\n\n`;
    }

    for (var j = 0; j < childNodes.length; j++) {
      const childNode = childNodes[j];

      if (childNode.nodeType == Node.TEXT_NODE) {
        nodeMarkdown += childNode.textContent;
      }

      if (childNode.nodeType === Node.ELEMENT_NODE) {
        const tag = childNode.tagName;

        if (tag === "P" || tag === "LI") {
          nodeMarkdown += parseParagraph(childNode);
        }
        if (tag === "OL") {
          nodeMarkdown += parseOrderedList(childNode);
        }
        if (tag === "UL") {
          nodeMarkdown += parseUnorderedList(childNode);
        }
        if (tag === "PRE") {
          nodeMarkdown += parseCodeBlock(childNode);
        }
        if (tag === "TABLE") {
          nodeMarkdown += parseTable(childNode);
        }
        if (tag === "CODE") {
          nodeMarkdown += parseInlineCode(childNode);
        } else {
          nodeMarkdown += "\n";
        }
      }
    }
  }

  return nodeMarkdown;
}


function getHorizontalRules() {
  return "----------\n\n";
}


function parseParagraph(node) {
  return replaceString(node.outerHTML) + "\n";
}


function parseOrderedList(node) {
  var orderedListMarkdown = "";
  node.childNodes.forEach((listItemNode, index) => {
    if (
      listItemNode.nodeType === Node.ELEMENT_NODE &&
      listItemNode.tagName === "LI"
    ) {
      orderedListMarkdown += `${index + node.start}. ${
        parseNode(listItemNode)
      }\n`;
    }
  });
  return orderedListMarkdown + "\n";
}


function parseUnorderedList(node) {
  var unorderedListMarkdown = "";
  node.childNodes.forEach((listItemNode, index) => {
    if (
      listItemNode.nodeType === Node.ELEMENT_NODE &&
      listItemNode.tagName === "LI"
    ) {
      unorderedListMarkdown += `- ${replaceString(listItemNode.outerHTML)}\n`;
    }
  });
  return unorderedListMarkdown + "\n";
}


function parseCodeBlock(node) {
  const splitContents = node.textContent.split("Copy code");
  const language = splitContents[0].trim();
  const code = splitContents[1].trim();

  return `\`\`\`${language}\n${code}\n\`\`\`\n`;
}


function parseInlineCode(node) {
  return "`" + node.textContent + "`";
}


function parseTable(node) {
  let tableMarkdown = "";
  node.childNodes.forEach((tableSectionNode) => {
    if (
      tableSectionNode.nodeType === Node.ELEMENT_NODE &&
      (tableSectionNode.tagName === "THEAD" ||
        tableSectionNode.tagName === "TBODY")
    ) {
      // Get table rows
      let tableRows = "";
      let tableColCount = 0;
      tableSectionNode.childNodes.forEach(
        (tableRowNode) => {
          if (
            tableRowNode.nodeType === Node.ELEMENT_NODE &&
            tableRowNode.tagName === "TR"
          ) {
            // Get table cells
            let tableCells = "";

            tableRowNode.childNodes.forEach(
              (tableCellNode) => {
                if (
                  tableCellNode.nodeType ===
                    Node.ELEMENT_NODE &&
                  (tableCellNode.tagName === "TD" ||
                    tableCellNode.tagName === "TH")
                ) {
                  tableCells += `| ${replaceString(tableCellNode.outerHTML)} `;
                  if (
                    tableSectionNode.tagName === "THEAD"
                  ) {
                    tableColCount++;
                  }
                }
              }
            );
            tableRows += `${tableCells}|\n`;
          }
        }
      );

      tableMarkdown += tableRows;

      if (tableSectionNode.tagName === "THEAD") {
        const headerRowDivider = `| ${Array(tableColCount)
          .fill("---")
          .join(" | ")} |\n`;
        tableMarkdown += headerRowDivider;
      }
    }
  });

  return tableMarkdown;
}