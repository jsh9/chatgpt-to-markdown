const getHorizontalRules = require('./getHorizontalRules');

function cleanUpString(inputString) {
  return trimEachLine(
    trimAndAddTrailingNewline(
      consolidateEmptyLines(removeLeadingHorizontalRule(inputString)),
    ),
  );
}

function removeLeadingHorizontalRule(inputString) {
  return inputString.substring(getHorizontalRules().length);
}

function consolidateEmptyLines(inputString) {
  return inputString.replace(/\n{3,}/g, '\n\n');
}

function trimAndAddTrailingNewline(inputString) {
  return inputString.trim() + '\n';
}

function trimEachLine(str) {
  let lines = str.split('\n');
  let inCodeBlock = false;

  const trimmedLines = lines.map((line) => {
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      return line.trimRight();
    }

    if (inCodeBlock) {
      return line;
    }

    const rightTrimmed = line.trimRight();

    if (/^\s*[-*]\s/.test(rightTrimmed)) {
      return rightTrimmed;
    }

    if (/^\s*\d+\.\s/.test(rightTrimmed)) {
      return rightTrimmed;
    }

    if (/^\s*>/.test(rightTrimmed)) {
      return rightTrimmed;
    }

    return rightTrimmed.trimStart();
  });

  return trimmedLines.join('\n');
}

module.exports = cleanUpString;
