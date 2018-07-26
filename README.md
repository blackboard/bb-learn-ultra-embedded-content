# Blackboard Learn Ultra Embedded Content
This repo provides *getting started* project directories (node packages) as well as common library React Components, utilities, and styles, for building an app that can be hosted and launched with LTI and communicate data back and forth with Learn on the front-end (using [PostMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) events). An app can also be launched as a "mashup" from the Rich Text Editor to embed content (or even an iFrame) directly in the content editor/authoring space.

# NPM Commands

## Setting Things Up
You can simply run `npm install` to install the root level devDependencies that are used by all librarys/example-apps, then `cd` into the respective folder, run `npm install` , and use the scripts provided in the (sub-package) `package.json` to install, develop, run locally, test, and eventually build/compile to the (sub-package) `/build` directory. `npm start` will run a serve the app locally at **http://localhost:4321** This will output a `bundle.js`, `bundle.js.map`, `index.html`, `styles.css`, and `styles.css.map`. Some commands may require prepending with `sudo` depending on your local configuration.

# Posting Messages
The enclosing window will accept messages sent from each content provider. See javascript's `postMessage` api for further details.

For example:
```javascript
window.parent.postMessage(message, document.referrer)
```
These messages must follow a specific configuration.

#### Sample Messages
Example 1
```typescript
{
    messageType: 'content_canceled'
}
```

Example 2
```typescript
{
    dataType: 'video', /* Required when type is 'content_ready' */
    dataContent: {
        alt: 'Some alternative text for accessibility', /* Required when type is 'content_ready' */
        src: 'src for embeddable content or links' /* Required when type is 'content_ready' and output is embeddable */
        /* ... dynamic key/value pairs */
        response?: {}
    }, /* Required when type is 'content_ready' */
    messageType: 'content_ready'
}
```
#### accepted values
`messageType`:
>'content_canceled': Close the dialog, canceling any actions,

>'content_ready': Send with content to signal change in ultra and apply to editor

`dataType`:
> 'video' or 'image'

# Receiving Messages
Add an event listener on `componentWillMount` to to handle messages posted from Blackboard Learn.

For example:
```javascript
window.addEventListener('message', receiveMessage, false);

function receiveMessage() {
    receiveMessage(event) {
        // This is a security measure to ensure that we only respond to messages
        // that originated from a parent/referrer that is the window embedding this iFrame
        if (document.referrer !== event.origin) {
            return;
        }

        // Respond to incoming message
    }
}
```
These messages must follow a specific configuration.

#### Sample Messages
Example 1
```typescript
{
    messageType: 'init_content',
    config: {},
    dataToDisplay: {
        mode: 'create',
        content: {
            dataType: 'embedded-app',
            dataContent: {},
        },
    },
}
```

#### accepted values
`messageType`:
>'init_content': Load the iFrame/mashup with respective configuration

`config`:
> 'apiBasePath': 'base api path for server queries'
> 'locale': 'localization string to select current locale'
> 'xsrfToken': 'token for secure server transactions'

`dataToDisplay`:
> 'mode': '"create", "edit", or "view"'
> 'content': 'object containing 'dataContent' and 'dataType' for editing existing mashups

# More Info
Check the `getting-started/typescript-react` or `getting-started/javascript-react` directory for step-by-step instructions to create and develop a new LTI single page application for launch. This is a good starting point for understanding the front-end communcation between Blackboard Learn Ultra's `Window` and the `iFrame` that your LTI app will launch in.

# Helper Utilities and Libraries
Find access to some common utilities/libraries that we have included to help match the styling and UX choices found in Ultra UI. We have also included various javascript utilities that we find helpful for our internal development workflow.

**TODO**: Add build config (write in typescript, compile to javascript) and implement proper tree-shaking to reduce compile size and consider ways to leverage Blackboard's in-house library to reduce duplicate work.

### How to include a Component
---
Simply add an import to the top of a file, ie.
```javascript
import { Spinner } from '../bb-public-library/react-components/lib'
```
NOTE: Typescript requires a different import format for resolving .js files
```javascript
import { Spinner } from '../bb-public-library/react-components/lib/index.js'

### How to Include a utility
---
Simply add an import to the top of a file, ie.
```javascript
import { configureTranslator } from '../bb-public-library/utilities/lib'
```
NOTE: Typescript requires a different import format for resolving .js files
```javascript
import { configureTranslator } from '../bb-public-library/utilities/lib/index.js'
```

# Documentation for Developers of this Entire Repo
~ [`_docs/README.md`](./_docs/#readme)
