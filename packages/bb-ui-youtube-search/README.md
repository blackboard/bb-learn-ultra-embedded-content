# YouTube Search Content Provider
YouTube Search provides an interface to search YouTube for relevant content and select a video from search results.

# NPM Commands

## How to install dependencies

Starting in the root, top-level directory
```bash
npm install
cd packages/{your-directory-name}
npm install
```
...or simply run `npm install:all` in the root directory

## How to run tests

```bash
npm test
```

## How to run tests with coverage

```bash
npm run test:coverage
```

This command will create a `coverage` folder. In this folder, there will be a file called `clover.xml`. In addition, Jest also creates a html report in `lcov-report/index.html`

## How to build content complete directory
```bash
npm run build
```
The build folder can then be compressed and uploaded to Ultra...

# Dev Only NPM Commands

## How to start a standalone dev server

```bash
npm start
```

This will open a server on port 4321 (http://localhost:4321) that will serve up the dev index.html file.

# More Info

## Javascript

Although we encourage the use of React for UI development, this is entirely optional. Start by modifying the javascript in `src/index.jsx` or change this file extension to `.js` for a vanilla javascript implementation or another preferred framework.

Note: Testing is initially configured to use Enzyme, "a Javascript Testing utility for React that makes it easier to assert, manipulate, and traverse your React Components' output." Read the docs here [http://airbnb.io/enzyme/].

## CSS

We have introduced basic integration of Tailwind CSS, "a utility-first CSS framework for rapidly building custom user interfaces." This will help with mobile-first, responsive design and provide common css helper classes. Read the docs here [https://tailwindcss.com/docs/what-is-tailwind/]. The tailwind config file is found at `src/styles/tailwind/tailwind.js`.

Note: To exclude Tailwind, simply remove or comment out `@tailwind preflight;` and `@tailwind utilities;` from `src/styles/tailwind/styles.css`

## SCSS

Add scss files by importing them directly into any .js or .jsx file. Webpack will take care of compiling and inlining styles in code. See `src/styles...` and `src/index.jsx` for a basic example of usage.

## Testing

## Helper Utilities and Libraries

Additionally, find access to some common utilities/libraries that we have included to help match the styling and UX choices found in Ultra UI. We have also included various javascript utilities that we find helpful for our internal development workflow.

Simply add an import to the top of a file, ie.
`import { someUtility } from '/libraries'`
