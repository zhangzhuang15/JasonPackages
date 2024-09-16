import { JZBoolean } from "./jz-boolean";
import { JZNumber } from "./jz-number";
import { JZOption } from "./jz-option";

export function jzArraySome<T>(
    array: T[], 
    predicate: Parameters<Array<T>['some']>['0']
) {
    const result = array.some(predicate);
    return JZBoolean.of(array, result);
}

export function jzArrayEvery<T>(
    array: T[],
    predicate: Parameters<Array<T>['every']>['0']
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

export function jzArrayFindIndex<T>(
    array: T[],
    predicate: Parameters<Array<T>['findIndex']>['0']
) {
    const result = array.findIndex(predicate);
    return JZNumber.of(result);
}

export function jzArrayFindLastIndex<T>(
    array: T[],
    predicate: Parameters<Array<T>['findLastIndex']>['0']
) {
    const result = array.findLastIndex(predicate);
    return JZNumber.of(result);
}

export function jzArrayIndexOf<T>(
    array: T[],
    value: T
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

export function jzArrayFind<T>(
    array: T[],
    predicate: Parameters<Array<T>['find']>['0']
){
    const result = array.find(predicate);
    return JZOption.of(result);
}

export function jzArrayFindLast<T>(
    array: T[],
    predicate: Parameters<Array<T>['findLast']>['0']
){
    const result = array.findLast(predicate);
    return JZOption.of(result);
}

export function jzArrayLengthGT<T>(
    array: T[],
    length: number
){
    return JZBoolean.of(array, array.length > length);
}

export function jzArrayLengthGE<T>(
    array: T[],
    length: number
){
    return JZBoolean.of(array, array.length >= length);
}

export function jzArrayLengthLT<T>(
    array: T[],
    length: number
){
    return JZBoolean.of(array, array.length < length);
}

export function jzArrayLengthLE<T>(
    array: T[],
    length: number
){
    return JZBoolean.of(array, array.length <= length);
}

export function jzArrayLengthEQ<T>(
    array: T[],
    length: number
){
    return JZBoolean.of(array, array.length === length);
}
