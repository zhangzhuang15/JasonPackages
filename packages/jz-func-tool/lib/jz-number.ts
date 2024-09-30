import { JZBoolean } from "./jz-boolean";
import { optional } from "./jz-option";

export class JZNumber {
    private constructor(private readonly value: number) {}

    gt(val: number) {
        return JZBoolean.of(
            this.value,
            this.value > val
        );
    }

    ge(val: number) {
        return JZBoolean.of(
            this.value,
            this.value >= val
        );
    }

    lt(val: number) {
        return JZBoolean.of(
            this.value,
            this.value < val
        );
    }
    
    le(val: number) {
        return JZBoolean.of(
            this.value,
            this.value <= val
        );
    }

    eq(val: number) {
        return JZBoolean.of(
            this.value,
            this.value === val
        );
    }

    ne(val: number) {
        return JZBoolean.of(
            this.value,
            this.value !== val
        );  
    }

    isPositive() {
        return this.gt(0);
    }

    isNegative() {
        return this.lt(0);
    }

    isntNegative() {
        return this.ge(0);
    }

    isntPositive() {
        return this.le(0);
    }

    isZero() {
        return this.eq(0);
    }

    isNaN() {
        return JZBoolean.of(
            this.value,
            Number.isNaN(this.value)
        );
    }

    isFloat() {
        return JZBoolean.of(
            this.value,
            this.value.toString().includes(".")
        );
    }

    isFinite() {
        return JZBoolean.of(
            this.value,
            Number.isFinite(this.value)
        );
    }

    between(low: number, high: number) {
        return JZBoolean.of(
            this.value,
            this.value > low && this.value <= high
        );
    }

    take() {
        return this.value;
    }

    map<U>(effect: (val: number) => U) {
        const result = effect(this.value);
        return optional(result);
    }

    static of(val: number) {
        return new JZNumber(val);
    }
}

/**
 * create jz-number, so you can benefit from it, enjoy
 * the functional programming advantage.
 * 
 * ## Example
 * ```ts
 * const values = [1, 10, 100]
 * const val = ctNumber(values[0])
 * val
 *  .gt(10)
 *  .orThen(_ => {
 *    console.log(_ + "is not bigger than ", 10)
 * })
 * ```
 * @param val 
 * @returns 
 */
export function ctNumber(val: number) {
    return JZNumber.of(val);
}