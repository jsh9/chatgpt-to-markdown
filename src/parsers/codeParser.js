function parseInlineCode(node) {
  return '`' + node.textContent + '`';
}

function parseCodeBlock(node) {
  const splitContents = node.textContent.split('Copy code');
  const language = splitContents[0].trim();
  const rawCode = splitContents[1].trimEnd();

  const codeLines = rawCode.split('\n');
  let minIndent = Infinity;

  for (const line of codeLines) {
    const trimmed = line.trim();
    if (trimmed.length === 0) {
      continue;
    }
    const leadingSpaces = line.match(/^\s*/)[0].length;
    if (leadingSpaces < minIndent) {
      minIndent = leadingSpaces;
    }
  }

  if (!isFinite(minIndent)) {
    minIndent = 0;
  }

  const dedentedLines =
    minIndent > 0
      ? codeLines.map((line) => line.slice(Math.min(minIndent, line.length)))
      : codeLines;

  const positiveIndents = dedentedLines
    .map((line) => line.match(/^\s*/)[0].length)
    .filter((indent) => indent > 0);

  let scaledLines = dedentedLines;

  if (positiveIndents.length > 0) {
    const baseIndent = Math.min(...positiveIndents);

    if (baseIndent > 4 && baseIndent % 4 === 0) {
      const scale = baseIndent / 4;
      scaledLines = dedentedLines.map((line) => {
        const match = line.match(/^(\s*)(.*)$/);
        const spaces = match[1].length;

        if (spaces === 0) {
          return match[2];
        }

        const normalizedSpaces = ' '.repeat(Math.round(spaces / scale));
        return normalizedSpaces + match[2];
      });
    }
  }

  const adjustedLines = scaledLines.map((line) => {
    const match = line.match(/^(\s*)(.*)$/);
    const content = match[2];

    if (/^[-*>]/.test(content)) {
      return content;
    }

    return line;
  });

  const normalizedCode = adjustedLines.join('\n');

  return `\`\`\`${language}\n${normalizedCode}\n\`\`\`\n`;
}

module.exports = {
  parseInlineCode,
  parseCodeBlock,
};
