/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/no-var-requires
import addon from "@jasonzhang/line-noise";

const argv = process.argv.slice(2);

if (argv.includes("--keyboard-playground")) {
  addon.enterKeycodesPlayground();
  process.exit();
}

addon.loadCompletionConfig();
addon.loadHintConfig();
addon.setHistoryCapacity(5);

let input = "";
while (1) {
  input = addon.prompt("JasonZhang> ");

  // add your command to history, so that
  // you can press ⬆️ or ⬇️ to walk commands
  addon.rememberCommand(input);

  if (input === "quit") {
    console.log("quit now");
    break;
  } else if (input === "single-line") {
    addon.openMultilineMode(0);
  } else if (input === "multi-line") {
    addon.openMultilineMode(1);
  } else {
    console.log("your input: ", input);
  }

  if (input === "mask") {
    addon.mask_your_input();
  } else if (input === "unmask") {
    addon.unmask_your_input();
  }
}

// it's not important what suffix of the history file,
// this function only save your memory command history to
// disk.
addon.saveCommandHistoryIntoFile("./my_command.history");
