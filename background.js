function isValidUrl(url) {
  const pattern = /^https:\/\/chat\.openai\.com\/.*$/;
  return pattern.test(url);
}


function showAlert() {
  alert('This extension only works on https://chat.openai.com/*');
}


chrome.action.onClicked.addListener(function (tab) {
  if (isValidUrl(tab.url)) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["./dist/minimizedChatGptToMarkdown.js"],
    });
  } else {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: showAlert,
    });
  }
});
