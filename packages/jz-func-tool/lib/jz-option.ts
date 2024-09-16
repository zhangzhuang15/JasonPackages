export type None = JZOption<null | undefined>;

export enum OptionType {
    None = 1,
    Some
}

export class JZOption<T> {
    private constructor(private value: T | undefined | null) {}

    static of<M>(v: M) {
        return new JZOption(v);
    }

    isSome() {
        return this.value !== undefined && this.value !== null;
    }

    isSomeAnd(effect: (val: T) => boolean) {
        if (this.isNone()) return false;

        return effect(this.value as T);
    }

    isNone() {
        return !this.isSome();
    }

    isNoneThen<U>(effect: (val: null | undefined) => U) {
        if (this.isSome()) return this;
        const result = effect(this.value as null | undefined);
        return JZOption.of(result);
    }

    isNull() {
        return this.value === null;
    }

    isNullThen<U>(effect: () => U) {
        if (this.isNull()) {
            const result = effect();
            return JZOption.of(result);
        }
        return this;
    }

    isUndefined() {
        return this.value === undefined;
    }

    isUndefinedThen<U>(effect: () => U) {
        if (this.isUndefined()) {
            const result = effect();
            return JZOption.of(result);
        }
        return this;
    }

    expect(msg: string) {
        if (this.isNone()) {
            throw new Error(msg);
        }

        return this.value as T;
    }

    andThen<M>(effect: (val: T) => M): None | JZOption<M> {
        if (this.isSome()) {
            const val = effect(this.value as T);
            return JZOption.of(val);
        }
        return (this as None);
    }

    or<M>(val: M): JZOption<T> | JZOption<M> {
        if (this.isSome()) {
            return this;
        }
        return JZOption.of(val);
    }

    orElse<M>(effect: () => M): JZOption<T> | JZOption<M> {
        if (this.isSome()) {
            return this;
        }
        return JZOption.of(effect());
    }

    replace(val: T) {
        const value = this.value;
        this.value = val;
        return JZOption.of(value) as None | JZOption<T>;
    }

    take(): None | JZOption<T> {
        const value = this.value;
        this.value = null;
        return JZOption.of(value) as None | JZOption<T>;
    }

    xor(val: JZOption<T>): None | JZOption<T> {
        if (this.isSome()) {
            return this;
        }

        if (val.isSome()) {
            return val;
        }

        return this;
    }

    and(val: JZOption<T>): None | JZOption<T> {
        if (this.isNone()) {
            return (this as None);
        }

        return val;
    }

    map<U>(effect: (val: T) => U): None | JZOption<U> {
        if (this.isNone()) return (this as None);

        const result = effect(this.value as T);
        return JZOption.of(result);
    }

    mapOr<U>(val: U, effect: (val: T) => U) {
        if (this.isNone()) {
            return val;
        }

        const result = effect(this.value as T);
        return result;
    }

    mapOrElse<U>(gen: () => U, effect: (val: T) => U) {
        if (this.isNone()) {
            return gen();
        }

        const result = effect(this.value as T);
        return result;
    }

    filter(effect: (val: T) => boolean): None | JZOption<T> {
        if (this.isNone()) {
            return this;
        }
        const result = effect(this.value as T);
        if (result) {
            return this;
        }
        return JZOption.of(null);
    }

    unwrap() {
        if (this.isNone()) {
            throw new Error("unwrap on None");
        }

        return this.value as T;
    }

    unwrapOr(val: T) {
        if (this.isSome()) return this.value as T;
        return val;
    }

    unwrapOrElse(effect: () => T) {
        if (this.isSome()) return this.value as T;
        return effect();
    }

    zip<U>(val: JZOption<U>): None | JZOption<[T, U]> {
        if (this.isNone() || val.isNone()) {
            return JZOption.of(null);
        }

        const value = val.unwrap();
        return JZOption.of([this.value, value] as [T, U])
    }

    enum() {
        if (this.isNone()) {
            return OptionType.None;
        }
        return OptionType.Some;
    }
}

export function optional<T>(val: T) {
    return JZOption.of(val);
}