import { JZBoolean } from './jz-boolean';
import { JZNumber } from './jz-number';
import { JZOption } from './jz-option';

/**
 * have same effect with Array.prototype.some,
 * but return a value supporting bool then.
 *
 * ## Example
 * ```ts
 * jzArraySome([1, 2, 3], (val) => val > 2)
 *   .andThen(array => console.log(array[0]))
 *   .fail(array => console.log(array[1]));
 * // print 1
 * ```
 * @param array
 * @param predicate
 * @returns
 */
export function jzArraySome<T>(
  array: T[],
  predicate: Parameters<Array<T>['some']>['0'],
) {
  const result = array.some(predicate);
  return JZBoolean.of(array, result);
}

export function jzArrayEvery<T>(
  array: T[],
  predicate: Parameters<Array<T>['every']>['0'],
) {
  const result = array.every(predicate);
  return JZBoolean.of(array, result);
}

export function jzArrayIncludes<T>(
  array: T[],
  value: T,
) {
  const result = array.includes(value);
  return JZBoolean.of(array, result);
}

/**
 * have same effect with Array.prototype.findIndex,
 * but return a value supporting boolean then.
 *
 * ## Example
 * ```ts
 * jzArrayFindIndex([1, 2, 3], (val) => val > 2)
 *   .ge(2)
 *   .andThen(index => console.log(index))
 *   .fail(index => console.log("not"));
 * // print 2
 * ```
 * @param array
 * @param predicate
 * @returns
 */
export function jzArrayFindIndex<T>(
  array: T[],
  predicate: Parameters<Array<T>['findIndex']>['0'],
) {
  const result = array.findIndex(predicate);
  return JZNumber.of(result);
}

export function jzArrayFindLastIndex<T>(
  array: T[],
  predicate: Parameters<Array<T>['findLastIndex']>['0'],
) {
  const result = array.findLastIndex(predicate);
  return JZNumber.of(result);
}

export function jzArrayIndexOf<T>(
  array: T[],
  value: T,
) {
  const result = array.indexOf(value);
  return JZNumber.of(result);
}

export function jzArrayLastIndexOf<T>(
  array: T[],
  value: T,
) {
  const result = array.lastIndexOf(value);
  return JZNumber.of(result);
}

/**
 * have same effect with Array.prototype.find, but return
 * an optional value.
 *
 * ## Example
 * ```ts
 * jzArrayFind([1, 2, 3], (val) => val > 2)
 *   .isSomeAnd(v => console.log(v))
 * // print "3"
 * ```
 * @param array
 * @param predicate
 * @returns
 */
export function jzArrayFind<T>(
  array: T[],
  predicate: Parameters<Array<T>['find']>['0'],
) {
  const result = array.find(predicate);
  return JZOption.of(result);
}

export function jzArrayFindLast<T>(
  array: T[],
  predicate: Parameters<Array<T>['findLast']>['0'],
) {
  const result = array.findLast(predicate);
  return JZOption.of(result);
}

export function jzArrayLengthGT<T>(
  array: T[],
  length: number,
) {
  return JZBoolean.of(array, array.length > length);
}

/**
 * array length ge operation
 *
 * ## Example
 * ```ts
 * jzArrayLengthGE([1, 2, 3], 3)
 *  .andThen(_ => console.log("array length is great than or equal to 3"));
 *  .fail(_ => console.log("array length is less than 3"));
 * // print "array length is great than or equal to 3"
 * ```
 * @param array
 * @param length
 * @returns
 */
export function jzArrayLengthGE<T>(
  array: T[],
  length: number,
) {
  return JZBoolean.of(array, array.length >= length);
}

export function jzArrayLengthLT<T>(
  array: T[],
  length: number,
) {
  return JZBoolean.of(array, array.length < length);
}

export function jzArrayLengthLE<T>(
  array: T[],
  length: number,
) {
  return JZBoolean.of(array, array.length <= length);
}

export function jzArrayLengthEQ<T>(
  array: T[],
  length: number,
) {
  return JZBoolean.of(array, array.length === length);
}
