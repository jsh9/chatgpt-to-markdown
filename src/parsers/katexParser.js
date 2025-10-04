const CONSTANTS = require('../constants');

function shouldIgnoreKatexSubtree(node) {
  if (!node || node.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }

  const className = typeof node.className === 'string' ? node.className : '';
  const classList = className.split(/\s+/).filter(Boolean);

  if (
    classList.includes(CONSTANTS.KATEX_CLASSES.HTML) ||
    classList.includes(CONSTANTS.KATEX_CLASSES.MATHML)
  ) {
    return true;
  }

  return false;
}

function parseKatexNode(node) {
  if (!node || node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const className = typeof node.className === 'string' ? node.className : '';
  const classList = className.split(/\s+/).filter(Boolean);

  const hasKatexClass = classList.includes(CONSTANTS.KATEX_CLASSES.KATEX);
  const hasDisplayClass = classList.includes(CONSTANTS.KATEX_CLASSES.DISPLAY);

  if (!hasKatexClass && !hasDisplayClass) {
    return null;
  }

  const parent = node.parentElement;
  const parentIsDisplay = Boolean(
    parent &&
      parent.classList &&
      typeof parent.classList.contains === 'function' &&
      parent.classList.contains(CONSTANTS.KATEX_CLASSES.DISPLAY),
  );

  if (hasKatexClass && parentIsDisplay && !hasDisplayClass) {
    // Skip the inner <span class="katex"> when a wrapping display node exists.
    return null;
  }

  const annotation = node.querySelector(
    'annotation[encoding="application/x-tex"]',
  );

  if (!annotation || typeof annotation.textContent !== 'string') {
    return null;
  }

  const latex = annotation.textContent.trim();

  if (latex.length === 0) {
    return null;
  }

  if (hasDisplayClass || parentIsDisplay) {
    return {
      markdown: '$$\n' + latex + '\n$$',
      type: 'display',
    };
  }

  return {
    markdown: `$${latex}$`,
    type: 'inline',
  };
}

module.exports = {
  shouldIgnoreKatexSubtree,
  parseKatexNode,
};
