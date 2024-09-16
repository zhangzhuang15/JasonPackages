import { JZBoolean } from "./jz-boolean";
import { JZNumber } from "./jz-number";

export function jzStringEndsWith(
    str: string,
    value: string,
) {
    return JZBoolean.of(str, str.endsWith(value));
}

export function jzStringStartsWith(
    str: string,
    value: string,
) {
    return JZBoolean.of(str, str.startsWith(value));
}

export function jzStringIncludes(
    str: string,
    value: string,
){
    return JZBoolean.of(str, str.includes(value));
}


export function jzStringLengthGT(
    str: string,
    length: number
){
    return JZBoolean.of(str, str.length > length);
}

export function jzStringLengthGE(
    str: string,
    length: number
){
    return JZBoolean.of(str, str.length >= length);
}

export function jzStringLengthLT(
    str: string,
    length: number
){
    return JZBoolean.of(str, str.length < length);
}

export function jzStringLengthLE(
    str: string,
    length: number
){
    return JZBoolean.of(str, str.length <= length);
}

export function jzStringLengthEQ(
    str: string,
    length: number
){
    return JZBoolean.of(str, str.length === length);
}

export function jzStringIndexOf(
    str: string,
    value: string
) {
    return JZNumber.of(str.indexOf(value));
}

export function jzStringLastIndexOf(
    str: string,
    value: string
) {
    return JZNumber.of(str.lastIndexOf(value));
}

export function jzStringSearch(
    str: string,
    value: Parameters<String['search']>['0']
) {
    return JZNumber.of(str.search(value));
}