function isValidUrl(url) {
  const pattern = /^https:\/\/chat\.openai\.com\/.*$/;
  return pattern.test(url);
}

chrome.browserAction.onClicked.addListener(function (tab) {
  if (isValidUrl(tab.url)) {
    chrome.tabs.executeScript(tab.id, { file: "./dist/minimizedChatGptToMarkdown.js" });
  } else {
    alert('This extension only works on https://chat.openai.com/*');
  }
});
