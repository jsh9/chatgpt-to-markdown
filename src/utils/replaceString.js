module.exports = function (input) {
    var input_ = convertUrlToMarkdown(input);

    var replaced = input_.replace(/<p>|<\/p>|<li>|<\/li>|<th>|<\/th>|<td>|<\/td>/gi, "")
        .replace(/<strong>|<\/strong>/gi, "**")
        .replace(/<em>|<\/em>/gi, "_")
        .replace(/<del>|<\/del>/gi, "~~")
        .replace(/<code>|<\/code>/gi, "`");

    return extractPlainTextFromHtml(replaced);
}


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
    var markdown = before + "[" + text + "](" + url + ")" + after;

    return markdown;
}


function extractPlainTextFromHtml(html) {
    // Create a temporary element to hold the HTML
    var tempEl = document.createElement("div");
    tempEl.innerHTML = html;

    // Traverse the document tree and extract text nodes
    var text = "";
    function traverse(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.textContent;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        for (var i = 0; i < node.childNodes.length; i++) {
          traverse(node.childNodes[i]);
        }
      }
    }
    traverse(tempEl);

    return text.trim();
}
