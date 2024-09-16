import { JZBoolean } from "./jz-boolean";

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

    isNonNegative() {
        return this.ge(0);
    }

    isNonPositive() {
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

    deref() {
        return this.value;
    }

    map<U>(effect: (val: number) => U) {
        const result = effect(this.value);
        if (typeof result === 'boolean') {
            return JZBoolean.of(this.value, result);
        }
        if (typeof result === 'number') {
            return JZNumber.of(result);
        }
        return result;
    }

    static of(val: number) {
        return new JZNumber(val);
    }
}