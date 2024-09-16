import { jzArrayEvery } from "@jasonzhang15/func-tool";

const arr = [1, 5, 10];

// imperative way
if (arr.every(item => item > 10)) {
    console.log("every item > 0")
} else {
    console.log("every item")
}

// functional way
const v = 
    jzArrayEvery(
        arr,
        item => item > 10
    ).andThen(val => {
        console.log("every item > 0")
        return [val[0], true] as [number, boolean]
    }).orThen(val => {
        console.log("every item")
        return [(val as number[])[1], false] as [number, boolean]
    }).take();
console.log(v);