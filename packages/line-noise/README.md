# line-noise

this is a nodejs addon based on c library linenoise which is used in Redis.

# feature

- input hint
- input completion when press Tab key
- multiline edit in your terminal
- like `realine`
- support both .cjs and .mjs on Node environment
- support typescript
- not support windows; macOS or linux is ok

## quick look

<video controls preload="none">
  <source src="./line-noise-demo.mp4" type="video/mp4"></source>
</video>

# install

1. make sure that you have Rust environment, otherwise, please visit Rust official website and install.it's not difficult at all.

2. run `npm install @jasonzhang/line-noise`

# usage

```js
const lineNoise = require("@jasonzhang/line-noise");

// ESModule:
// import lineNoise from "@jasonzhang/line-noise";

const argv = process.argv.slice(2);

if (argv.includes("--keyboard-playground")) {
  lineNoise.enterKeycodesPlayground();
  process.exit();
}

lineNoise.loadCompletionConfig();
lineNoise.loadHintConfig();
lineNoise.setHistoryCapacity(5);

let input = "";
while (1) {
  input = lineNoise.prompt("JasonZhang> ");

  // add your command to history, so that
  // you can press ⬆️ or ⬇️ to walk commands
  lineNoise.rememberCommand(input);

  if (input === "quit") {
    console.log("quit now");
    break;
  } else if (input === "single-line") {
    lineNoise.openMultilineMode(0);
  } else if (input === "multi-line") {
    lineNoise.openMultilineMode(1);
  } else {
    console.log("your input: ", input);
  }

  if (input === "mask") {
    lineNoise.mask_your_input();
  } else if (input === "unmask") {
    lineNoise.unmask_your_input();
  }
}

// it's not important what suffix of the history file,
// this function only save your memory command history to
// disk.
lineNoise.saveCommandHistoryIntoFile("./my_command.history");
```

there is a wonderful .d.ts for this package, so every API has rich comment when you write code on Visual Studio Code.

talk is cheap, please take a try!
