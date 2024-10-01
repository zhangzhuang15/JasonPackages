import { jzArrayEvery } from '@jasonzhang15/bool-then';

const arr = [1, 5, 10];

// imperative way
if (arr.every(item => item > 10)) {
  console.log('every item > 0');
} else {
  console.log('every item');
}

// functional way
const result = jzArrayEvery(arr, item => item > 10);
result.andThen(val => { console.log('every item > 0'); });
result.orThen(val => { console.log('every item'); });

// or
jzArrayEvery(arr, item => item > 10)
  .andThen(_ => { console.log('every item > 0'); })
  .fail(_ => { console.log('every item'); });
