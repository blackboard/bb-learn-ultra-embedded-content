# Common Component bb-library-utilities
We have included this set of helper utilities to provide common, Blackboard functions that were abstracted for re-use.

## How to Include a utility
Simply add an import to the top of a file, ie.
```javascript
import { configureTranslator } from '../packages/bb-library-utilities/main'
```
NOTE: Typescript requires a different import format for resolving .js files
```javascript
import { configureTranslator } from '../packages/bb-library-utilities/main/index.js'
```