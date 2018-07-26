# Blackboard Learn Ultra Embedded Content
This repo provides a bb-library-ui-components and utilities, as well as a getting started project, for building a Blackboard style content provider to embed content in Learn Ultra.

# NPM Commands

## How to run scripts in all sub-folders

You can simply run `npm install` to install the root level devDependencies that are used by all librarys/example-apps, then cd into the respective folder and use the scripts provided in its `package.json`...or try the following commands to install *everything*. Starting in the root, top-level directory, the following will run scripts at the root level and each "node package" in the libraries, example apps, and getting started apps starting first with the library packages.


### Install all dependencies
You can simple run `npm install` to install the root level devDependencies that are used by all librarys/example-apps or you can run the following to run `npm install` in every app folder that has its own `package.json`
```bash
npm run install:all
```

### Run all tests
```bash
npm run test:all
```

### Run all tests with coverage
```bash
npm run test:coverage:all
```

This command will create a `/coverage` folder. In this folder, there will be a file called `clover.xml`. In addition, Jest also creates an html report in `/coverage/lcov-report/index.html`

### Run all linters
```bash
npm run lint:all
```
