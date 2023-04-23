const getHorizontalRules = require("./getHorizontalRules");


function cleanUpString(inputString) {
  return trimAndAddTrailingNewline(
    consolidateEmptyLines(
      removeLeadingHorizontalRule(
        inputString,
      ),
    ),
  );
}


function removeLeadingHorizontalRule(inputString) {
  return inputString.substring(getHorizontalRules().length);
}


function consolidateEmptyLines(inputString) {
  return inputString.replace(/\n{3,}/g, "\n\n");
}


function trimAndAddTrailingNewline(inputString) {
  return inputString.trim() + "\n";
}


module.exports = cleanUpString;
