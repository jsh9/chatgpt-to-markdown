const replaceString = require("./replaceString");
const getHorizontalRules = require("./getHorizontalRules");


function parseNode(node, level) {
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
          nodeMarkdown += parseOrderedList(childNode, level);
        }
        if (tag === "UL") {
          nodeMarkdown += parseUnorderedList(childNode, level);
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


function parseParagraph(node) {
  return replaceString(node.outerHTML) + "\n";
}


function parseOrderedList(node, level) {
  var orderedListMarkdown = "\n";
  const spaces = getSpaces(level);
  node.childNodes.forEach((listItemNode, index) => {
    if (
      listItemNode.nodeType === Node.ELEMENT_NODE &&
      listItemNode.tagName === "LI"
    ) {
      orderedListMarkdown += `${spaces}${index + node.start}. ${
        parseNode(listItemNode, level + 1)
      }\n`;
    }
  });
  return orderedListMarkdown + "\n";
}


function parseUnorderedList(node, level) {
  var unorderedListMarkdown = "\n";
  const spaces = getSpaces(level);
  node.childNodes.forEach((listItemNode, index) => {
    if (
      listItemNode.nodeType === Node.ELEMENT_NODE &&
      listItemNode.tagName === "LI"
    ) {
      unorderedListMarkdown += `${spaces}- ${
        parseNode(listItemNode, level + 1)
      }\n`;
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


function getSpaces(level) {
  // Multiply the level by 4 to get the number of spaces
  const numSpaces = level * 4;

  // Create a new string with the specified number of spaces
  return " ".repeat(numSpaces);
}


module.exports = parseNode;
