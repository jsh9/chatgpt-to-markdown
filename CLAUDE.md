# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build
```bash
npm run build
```
Builds the extension using webpack in production mode. Creates minified scripts in the `dist` folder.

### Testing
```bash
npm test
# or directly
npx jest
```
Runs unit tests using Jest with JSDOM environment for DOM testing.

### Code Formatting
```bash
npm run auto-format
```
Auto-formats JavaScript files in `src/` and `tests/` directories using Prettier.

### Install Dependencies
```bash
npm install
```

## Architecture

This is a Chrome/Edge browser extension that converts ChatGPT conversation pages to markdown format.

### Core Components

- **Main Entry Point**: `src/chatGptToMarkdown.js` - The main content script that extracts ChatGPT messages and converts them to markdown
- **Element Parser**: `src/utils/parseElements.js` - Handles parsing of DOM elements from ChatGPT interface
- **Node Parser**: `src/utils/parseNode.js` - Converts individual DOM nodes to markdown
- **File Saver**: `src/utils/consoleSave.js` - Handles downloading the generated markdown file
- **Background Script**: `background.js` - Chrome extension background service worker

### Extension Structure

- **Manifest**: `manifest.json` - Chrome Extension Manifest v3 configuration
- **Webpack Config**: `webpack.config.js` - Builds content scripts for production
- **Icon Assets**: `icon_drawing_scripts/` - Extension icon files

### Testing

- **Test Files**: Located in `tests/` directory
- **Test Cases**: `tests/utils/test_cases/` contains HTML/markdown pairs for validation
- **Main Tests**:
  - `tests/utils/parseElements.test.js` - Tests element parsing logic
  - `tests/utils/blockQuoteUtils.test.js` - Tests block quote handling

### Key Features

- Detects ChatGPT messages via `[data-message-author-role]` selectors or fallback to `[class*='min-h-[20px]']`
- Handles various markdown elements: headers, lists, tables, code blocks, block quotes
- Supports keyboard shortcut: Alt+Shift+5 (Option+Shift+5 on macOS)
- Downloads conversations as `.md` files to user's Downloads folder

### Version Consistency

The codebase requires version consistency between `package.json` and `manifest.json`. The CI pipeline checks this automatically via `.github/workflows/check_package_and_manifest_versions.sh`.