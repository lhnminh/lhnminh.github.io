# Repository Guidelines

## Project Structure & Module Organization

This repository is a small static personal site served from the repository root.

- `index.html` contains the page markup, metadata, Google Analytics snippet, and section content.
- `style.css` contains layout, typography, responsive styling, and interaction states.
- `script.js` handles local time display, section navigation, view transitions, expandable experience items, and cursor spotlight effects.
- `images/` stores favicons, Open Graph images, and reusable visual assets.
- `fonts/` stores local font files used by the site.

There is no build system or framework. Keep new files lightweight.

## Build, Test, and Development Commands

Open the site directly in a browser:

```sh
open index.html
```

Run a local static server when an HTTP origin is useful:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

Check tracked changes before committing:

```sh
git status
git diff
```

## Coding Style & Naming Conventions

Use two-space indentation in HTML, CSS, and JavaScript. Keep class names descriptive, lowercase, and hyphenated, for example `.about-contact` or `.exp-summary`.

Prefer plain, dependency-free JavaScript. Keep DOM selectors close to the behavior they support. In CSS, group related rules under short section comments and preserve the muted, serif visual style.

## Testing Guidelines

There is no automated test suite. Validate changes manually in a browser after editing:

- Navigation links switch sections and update the URL hash.
- Experience items expand and collapse correctly.
- The New York time display updates.
- Layout remains readable on narrow and desktop widths.
- Favicons, Open Graph image paths, and external links still resolve.

If adding automated checks later, document the exact command here.

## Commit & Pull Request Guidelines

Recent commits use short summaries such as `Move Google Analytics script inside head` and `added favicon linking`. Keep commit subjects concise and focused on one change.

Pull requests should include a brief description, screenshots for visual changes, and notes about manual browser testing. Link related issues when applicable. For content edits, mention the affected section, such as `about`, `experience`, or `education`.

## Agent-Specific Instructions

Make small, explainable changes. Before editing, inspect the relevant file and describe the intended change step by step so future contributors can follow the reasoning.
