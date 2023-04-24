# chatgpt-to-markdown

This is a Chrome and Edge extension to download the ChatGPT Q&A page into a markdown file.

## 1. Installation

This extension is not on the Chrome Web Store yet. To install it manually into your Chrome or Edge browser, following the steps below:

1. Download this extension. You can choose either options:
    * Download the latest stable release from the [Releases](https://github.com/jsh9/chatgpt-to-markdown/releases) page
    * Clone this repository (which may contain newer-than-stable features). [Here](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)) is how to clone a Github repository.

2. Manually load the downloaded/cloned files into the browser:
    * [Chrome](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked)
    * [Edge](https://learn.microsoft.com/en-us/microsoft-edge/extensions-chromium/getting-started/extension-sideloading)

## 2. How to use

Navigate to ChatGPT, and to the conversation that you'd like to save as markdown.

Then click on the icon of this extension, or use the following keyboard shortcut:
- Windows and Linux: `Alt + Shift + 5`
- macOS: `Option + Shift + 5`

A markdown file will automatically be saved to your `Downloads` folder.

## 3. Local debugging and testing (for developers)

You can clone this repository, make small tweaks to it (if you code Javascript) as you'd like.

### 3.1. Building the project

To install and lock the dependencies, run:

```bash
npm install
```

To build the code, run:

```bash
npm run build
```

### 3.2. Testing

To run unit tests, first install dependencies, and then:

```bash
npx jest
```

### 3.3. CI/CD

Every pull request will trigger a CI/CD pipeline run, the steps of which are defined in [`./github/workflows/pipeline.yml`](./github/workflows/pipeline.yml).

The pipeline automatically checks for the following:
- The package version (in `package.json`) is consistent with the locked-down version (in `package-lock.json`)
- Versions in `manifest.json` and `package.json` are consistent
- The unit tests can all pass
- The minified script in `dist` is up to date with the code in `src`

## 4. Acknowledgement

- The core code is adapted from code files in https://github.com/ryanschiang/chatgpt-export
  + The original license is included on the top of the files, if they are partially or fully from the original repository
- ChatGPT helped draw the icon of this extension
  + The folder [icon_drawing_scripts](./icon_drawing_scripts/) contains the chat transcript, the Python script for drawing the icon, and all draft icons
