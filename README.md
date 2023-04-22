# chatgpt-to-markdown

This is a Chrome and Edge extension to download the ChatGPT Q&A page into a markdown file.

## 1. Installation

This extension is not on the Chrome Web Store yet. To install it manually into your Chrome or Edge browser, clone this repository to your hard drive, and then follow these instructions:

- [Chrome](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked)
- [Edge](https://learn.microsoft.com/en-us/microsoft-edge/extensions-chromium/getting-started/extension-sideloading)

## 2. How to use

Navigate to ChatGPT, and to the conversation that you'd like to save as markdown.

Then click on the icon of this extension, or use the following keyboard shortcut:
- Windows and Linux: `Alt + Shift + 5`
- macOS: `Option + Shift + 5`

A markdown file will automatically be saved to your `Downloads` folder.

## 3. Local debugging and testing

You can clone this repository, make small tweaks to it (if you code Javascript) as you'd like.

To lock the dependencies, run:

```bash
npm install
```

To build the code, run:

```bash
npm run build
```

## 4. Acknowledgement

- The core code is adapted from code files in https://github.com/ryanschiang/chatgpt-export
  + The original license is included on the top of the files, if they are partially or fully from the original repository
- ChatGPT helped draw the icon of this extension
  + The folder [icon_drawing_scripts](./icon_drawing_scripts/) contains the chat transcript, the Python script for drawing the icon, and all draft icons
