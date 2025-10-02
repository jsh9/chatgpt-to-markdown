const consoleSave = require('./utils/consoleSave');
const parseElements = require('./utils/parseElements');

(function chatGptToMarkdown() {
  let elements = document.querySelectorAll('[data-message-author-role]');

  if (!elements || elements.length === 0) {
    elements = document.querySelectorAll("[class*='min-h-[20px]']");
  }
  const markdown = parseElements(elements);

  if (typeof markdown === 'string' && markdown.trim().length > 0) {
    consoleSave(console, 'md');
    console.save(markdown);
  }

  return markdown;
})();
