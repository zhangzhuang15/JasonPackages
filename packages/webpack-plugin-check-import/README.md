## Description
When you use an undefined variable from your import statement, webpack still works.But in runtime, your code will crash because
of this. You have to set `module.strictExportPresence` true in
your webpack config file, make webpack failed to build if it
find that a variable is undefined in your import statement.

In this way, it also brings another problem:
```js
import * as M from "./mod.js"

if (M.jack) {
    M.jack()
}
```
You want to access variable which is mounted on M dymatically,
but webpack will say no to you, and build failed.

To solve this conflict, here is this plugin.

## Usage
You don't need to set `module.strictExportPresence`, just import
plugin like this:
```js 
// webpack.config.js
const JasonZhangCheckImportPlugin = require("@jasonzhang15/webpack-plugin-check-import");

module.exports = {
    plugins: [new JasonZhangCheckImportPlugin()]
}
```

it's done!

```js 
// src/main.js

import { A, B } from "./mod"
import * as M from "./mod"

// assume that only B is undefined

// dont make webpack failed
if (M.B) {
    M.B()
}

A()

// make webpack failed
B()
```

## Caveat
If this plugin makes sure that there is undefined variable in your
import statement(not `M.jack`, just `import { jack } from "./mod.js"`), it will make webpack failed.


## Future
Right now, I just support commonjs, but esm is not far.