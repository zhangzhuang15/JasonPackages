import { ctNumber } from "@jasonzhang15/bool-then";

ctNumber(10)
 .gt(100)
 .andThen(_ => {
    console.log(_ + "is bigger than 100")
 })
 .fail(_ => {
    console.log(_ + "is smaller than 100")
 })