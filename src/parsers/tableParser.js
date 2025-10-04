function parseTable(node, replaceString) {
  let tableMarkdown = '\n';
  node.childNodes.forEach((tableSectionNode) => {
    if (
      tableSectionNode.nodeType === Node.ELEMENT_NODE &&
      (tableSectionNode.tagName === 'THEAD' ||
        tableSectionNode.tagName === 'TBODY')
    ) {
      // Get table rows
      let tableRows = '';
      let tableColCount = 0;
      tableSectionNode.childNodes.forEach((tableRowNode) => {
        if (
          tableRowNode.nodeType === Node.ELEMENT_NODE &&
          tableRowNode.tagName === 'TR'
        ) {
          // Get table cells
          let tableCells = '';

          tableRowNode.childNodes.forEach((tableCellNode) => {
            if (
              tableCellNode.nodeType === Node.ELEMENT_NODE &&
              (tableCellNode.tagName === 'TD' || tableCellNode.tagName === 'TH')
            ) {
              tableCells += `| ${replaceString(tableCellNode.outerHTML)} `;
              if (tableSectionNode.tagName === 'THEAD') {
                tableColCount++;
              }
            }
          });
          tableRows += `${tableCells}|\n`;
        }
      });

      tableMarkdown += tableRows;

      if (tableSectionNode.tagName === 'THEAD') {
        const headerRowDivider = `| ${Array(tableColCount)
          .fill('---')
          .join(' | ')} |\n`;
        tableMarkdown += headerRowDivider;
      }
    }
  });

  return tableMarkdown;
}

module.exports = {
  parseTable,
};
