import { ctBoolean } from "@jasonzhang15/bool-then";

ctBoolean(true, 100)
  .andThen(_ => {
    console.log("yes" + _)
  })
  .fail(_ => {
    console.log("no" + _)
  })