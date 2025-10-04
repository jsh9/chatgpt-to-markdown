module.exports = function (input) {
  var input_ = convertUrlToMarkdown(input);

  var replaced = input_
    .replace(/<p>|<\/p>|<li>|<\/li>|<th>|<\/th>|<td>|<\/td>/gi, '')
    .replace(/<strong\b[^>]*>/gi, '**')
    .replace(/<\/strong>/gi, '**')
    .replace(/<b\b[^>]*>/gi, '**')
    .replace(/<\/b>/gi, '**')
    .replace(/<em\b[^>]*>/gi, '_')
    .replace(/<\/em>/gi, '_')
    .replace(/<i\b[^>]*>/gi, '_')
    .replace(/<\/i>/gi, '_')
    .replace(/<del\b[^>]*>/gi, '~~')
    .replace(/<\/del>/gi, '~~')
    .replace(/<code\b[^>]*>/gi, '`')
    .replace(/<\/code>/gi, '`');

  return extractPlainTextFromHtml(replaced);
};

function convertUrlToMarkdown(html) {
  // Regular expression to match an HTML link element
  var linkRegex = /<a href="([^"]+)"[^>]*>(.*?)<\/a>/;

  // Extract the link URL and text content
  var match = linkRegex.exec(html);

  if (match === null) {
    // Return the original HTML string if no link is found
    return html;
  }

  var url = match[1];
  var text = match[2];

  // Get the parts of the input string before and after the link
  var before = html.substr(0, match.index);
  var after = html.substr(match.index + match[0].length);

  // Construct the markdown string with the link and surrounding text
  var markdown = before + '[' + text + '](' + url + ')' + after;

  return markdown;
}

function extractPlainTextFromHtml(html) {
  // Create a temporary element to hold the HTML
  var tempEl = document.createElement('div');
  tempEl.innerHTML = html;

  // Traverse the document tree and extract text nodes
  var parts = [];

  function traverse(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      parts.push(node.textContent);
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return;
    }

    if (isKatexDisplayNode(node)) {
      const latex = extractKatexLatex(node);

      if (latex !== null) {
        const indent = getDisplayIndent(node);
        parts.push(indent + '$$\n' + latex + '\n' + indent + '$$');
      }

      return;
    }

    if (isKatexStructuralNode(node)) {
      return;
    }

    if (isKatexInlineNode(node)) {
      const latex = extractKatexLatex(node);

      if (latex !== null) {
        parts.push(`$${latex}$`);
      }

      return;
    }

    if (node.tagName === 'BR') {
      parts.push('\n');
      return;
    }

    for (var i = 0; i < node.childNodes.length; i++) {
      traverse(node.childNodes[i]);
    }
  }

  traverse(tempEl);

  return parts.join('').trim();
}

function extractKatexLatex(node) {
  const annotation = node.querySelector(
    'annotation[encoding="application/x-tex"]',
  );

  if (!annotation || typeof annotation.textContent !== 'string') {
    return null;
  }

  const latex = annotation.textContent.trim();
  return latex.length > 0 ? latex : null;
}

function hasClass(node, className) {
  return (
    node.classList &&
    typeof node.classList.contains === 'function' &&
    node.classList.contains(className)
  );
}

function isKatexDisplayNode(node) {
  if (!node || node.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }

  if (hasClass(node, 'katex-display')) {
    return true;
  }

  return hasClass(node, 'katex') && node.getAttribute('display') === 'block';
}

function isKatexStructuralNode(node) {
  if (!node || node.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }

  const structuralClasses = ['katex-html', 'katex-mathml', 'katex-svg'];

  for (var i = 0; i < structuralClasses.length; i++) {
    if (hasClass(node, structuralClasses[i])) {
      return true;
    }
  }

  if (hasClass(node, 'katex')) {
    const parent = node.parentElement;

    if (parent && isKatexDisplayNode(parent)) {
      return true;
    }
  }

  return false;
}

function isKatexInlineNode(node) {
  if (!node || node.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }

  if (!hasClass(node, 'katex')) {
    return false;
  }

  if (isKatexDisplayNode(node)) {
    return false;
  }

  const parent = node.parentElement;

  if (parent && isKatexDisplayNode(parent)) {
    return false;
  }

  return true;
}

function getDisplayIndent(node) {
  var current = node.parentElement;

  while (current) {
    if (current.tagName === 'LI') {
      return '  ';
    }

    current = current.parentElement;
  }

  return '';
}
