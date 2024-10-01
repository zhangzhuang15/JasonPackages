export type None = JZOption<null | undefined>;

export enum OptionType {
  None = 1,
  Some,
}

export const none = Symbol('none-for-jz-boolean');
export type NoneSymbol = typeof none;

export class JZOption<T, K = undefined> {
  private constructor(
    private value: T | undefined | null,
    private extraOnlyForJzBoolean?: K,
  ) {}

  /**
     * create an Option.
     *
     * the second param is internal, just ignore it.
     *
     * ## Example
     * ```ts
     * const p = JZOption.of(10)
     * ```
     * @param v
     * @param extraValue
     * @internal extraValue
     * @returns
     */
  static of<M, P>(v: M, extraValue?: P) {
    return new JZOption(v, extraValue);
  }

  /**
     * it is true if wrapped value in this Option is not null or not undefined.
     *
     * ## Example
     * ```ts
     * const p = optional(null)
     * if (p.isSome()) {
     *   console.log("hello")
     * }
     * // nothing print
     *
     * const q = optional(undefined)
     * if (q.isSome()) {
     *   console.log("hello")
     * }
     * // nothing print
     *
     * const x = optional(0)
     * if (x.isSome()) {
     *   console.log("hello")
     * }
     * // print "hello"
     * ```
     * @returns
     */
  isSome() {
    return this.value !== undefined && this.value !== null;
  }

  /**
     * if wrapped value in this Option is not null or not undefined, we will
     * execute effect(value), and return the result; otherwise, return false
     * directly.
     *
     * ## Example
     * ```ts
     * const p = optional(10)
     * const result =
     *  p.isSomeAnd((v) => { console.log("hello: ", v); return 100; });
     * // print "hello: 10"
     * // result is 100
     *
     * const q = optional(null)
     * const response = q.isSomeAnd((v) => {
     *      console.log("hello world");
     *      return 10;
     * });
     * // nothing print
     * // response is false
     * ```
     * @param effect
     * @returns
     */
  isSomeAnd(effect: (val: T) => boolean) {
    if (this.isNone()) return false;

    return effect(this.value as T);
  }

  /**
     * it's true if wrapped value in this Option is null or undefined
     *
     * ## Example
     * ```ts
     * const p = optional(10)
     * p.isNone(); // false
     *
     * const q = optional(null);
     * q.isNone(); // true
     *
     * const x = optional(undefined);
     * x.isNone(); // true
     *
     * ```
     * @returns
     */
  isNone() {
    return !this.isSome();
  }

  /**
     * if this Option is None, execute effect(value), return another
     * Option wrapping the result; otherwise, return this Option itself
     *
     * ## Example
     * ```ts
     * const p = optional(null)
     * const q = p.isNoneThen(() => {
     *  console.log("hello");
     *  return 100;
     * })
     * // print "hello"
     * // q is Option wrapping value 100.
     * ```
     * @param effect
     * @returns
     */
  isNoneThen<U>(effect: (val: null | undefined) => U) {
    if (this.isSome()) return this;
    const result = effect(this.value as null | undefined);
    return JZOption.of(result);
  }

  /**
     * it's true if wrapped value in this Option is null
     *
     * ## Example
     * ```ts
     * const p = optional(null)
     * p.isNull(); // true
     *
     * const q = optional(undefined)
     * q.isNull(); // false
     * ```
     * @returns
     */
  isNull() {
    return this.value === null;
  }

  /**
     * if wrapped value in this Option is null,
     * execute effect(), return another Option wrapping
     * the result; otherwise, return this Option itself.
     * @param effect
     * @returns
     */
  isNullThen<U>(effect: () => U) {
    if (this.isNull()) {
      const result = effect();
      return JZOption.of(result);
    }
    return this;
  }

  /**
   * return true if wrapped value in this Option is undefined
   *
   * ## Example
   * ```ts
   * const p = optional(undefined)
   * p.isUndefined(); // true
   *
   * const q = optional(null)
   * q.isUndefined(); // false
   * ```
   * @returns
   */
  isUndefined() {
    return this.value === undefined;
  }

  /**
   * execute effect() if wrapped value in this Option is undefined,
   * return another Option wrapping the result; otherwise, return this Option itself.
   *
   * ## Example
   * ```ts
   * const p = optional(undefined)
   * p.isUndefinedThen(() => { console.log("hello") })
   * // print "hello"
   * ```
   * @param effect
   * @returns
   */
  isUndefinedThen<U>(effect: () => U) {
    if (this.isUndefined()) {
      const result = effect();
      return JZOption.of(result);
    }
    return this;
  }

  /**
   * throw error if wrapped value in this Option is null or undefined,
   * otherwise return the wrapped value
   *
   * ## Example
   * ```ts
   * const p = optional(10)
   * const v = p.expect("hello");
   * v === 10; // true
   *
   * const q = optional(null);
   * try {
   *   q.expect("hello");
   * } catch(error) {
   *   console.log(error)
   * }
   * ```
   * @param msg
   * @returns
   */
  expect(msg: string) {
    if (this.isNone()) {
      throw new Error(msg);
    }

    return this.value as T;
  }

  /**
   * execute effect(wrappedValue) if wrapped value in this Option is
   * not null or not undefined, return another Option wrapping the result;
   * otherwise, return this Option itself.
   *
   * ## Example
   * ```ts
   * const p = optional(10)
   * const v = p.andThen(val => val+100);
   * // v is an Option, wrapping value 110
   * ```
   * @param effect
   * @returns
   */
  andThen<M>(effect: (val: T) => M): None | JZOption<M> {
    if (this.isSome()) {
      const val = effect(this.value as T);
      return JZOption.of(val);
    }
    return (this as None);
  }

  /**
   * if wrapped value in this Option is not null or not undefined,
   * return this Option iteself, otherwise, return another Option wrapping val
   *
   * ## Example
   * ```ts
   * const p = optional(10)
   * const q = p.or(20);
   * p === q; // true
   *
   * const x = optional(null)
   * const y = x.or(20);
   * // y wrapping value 20
   * ```
   * @param val
   * @returns
   */
  or<M>(val: M): JZOption<T, K> | JZOption<M, K> {
    if (this.isSome()) {
      return this;
    }
    return JZOption.of(val) as JZOption<M, K>;
  }

  /**
   * if wrapped value in this Option is not null or not undefined,
   * return this Option iteself, otherwise, execute effect(), and
   * return another Option wrapping the result.
   *
   * ## Example
   * ```ts
   * const p = optional(10)
   * const q = p.orElse(() => 100)
   * p === q; // true
   *
   * const x = optional(null)
   * const y = x.orElse(() => 100)
   * // y wrapping value 100
   * ```
   * @param effect
   * @returns
   */
  orElse<M>(effect: () => M): JZOption<T, K> | JZOption<M, K> {
    if (this.isSome()) {
      return this;
    }
    return JZOption.of(effect()) as JZOption<M, K>;
  }

  /**
     * replace the wrapped value with val, and return another Option
     * wrapping that wrapped value
     *
     * ## Example
     * ```ts
     * const p = optional(100);
     * const v = p.replace(10);
     * // v is wrapping value 100;
     * // p is wrapping value 10;
     * ```
     * @param val
     * @returns
     */
  replace(val: T) {
    const { value } = this;
    this.value = val;
    return JZOption.of(value) as None | JZOption<T>;
  }

  /**
     * take out the wrapped value from the Option, and
     * assign null to the wrapped value of Option, return
     * another Option wrapping that taken-out value
     *
     * ## Example
     * ```ts
     * const p = optional(100)
     * const v = p.take();
     * // v is wrapping value 100
     * // p is wrapping value null, so p is None
     * p.isNone(); // true
     * ```
     *
     * @returns
     */
  take(): None | JZOption<T> {
    const { value } = this;
    this.value = null;
    return JZOption.of(value) as None | JZOption<T>;
  }

  /**
   * if wrapped value in this Option is not null or not undefined,
   * return this Option itself; if wrapped value in val
   * is not null or not undefined, return val; otherwise, return
   * this Option itself.
   *
   * ## Example
   * ```ts
   * const p = optional(10)
   * const q = p.xor(optional(null))
   * p === q; // true
   *
   * const x = optional(null)
   * const y = x.xor(optional(10))
   * // y is wrapping value 10
   * const z = x.xor(optional(null))
   * x === z;// true
   *
   * ```
   * @param val
   * @returns
   */
  xor(val: JZOption<T, K>): None | JZOption<T, K> {
    if (this.isSome()) {
      return this;
    }

    if (val.isSome()) {
      return val;
    }

    return this;
  }

  /**
   * if wrapped value in this Option is not null or not undefined, return val;
   * otherwise, return this Option itself.
   *
   * ## Example
   * ```ts
   * const p = optional(10)
   * const q = p.and(optional(100))
   * // q is wrapping value 100
   *
   * const x = optional(null)
   * const y = x.and(optional(100))
   * x === y; // true
   * ```
   * @param val
   * @returns
   */
  and(val: JZOption<T>): None | JZOption<T> {
    if (this.isNone()) {
      return (this as None);
    }

    return val;
  }

  /**
     * if wrapped value in this Option is null or undefined, return this Option itself;
     * otherwise, execute effect(value), return another Option wrapping the result.
     *
     * ## Example
     * ```ts
     * const p = optional(null)
     * const q = p.map(_ => 10)
     * p === q; // true
     *
     * const x = optional(10)
     * const y = x.map(v => v * 10);
     * x === y; // false
     * // y is wrapping value 100
     * ```
     * @param effect
     * @returns
     */
  map<U>(effect: (val: T) => U): None | JZOption<U> {
    if (this.isNone()) return (this as None);

    const result = effect(this.value as T);
    return JZOption.of(result);
  }

  /**
     * if wrapped value in this Option is null or undefined, return val;
     * otherwise, execute effect(wrappedValue), return the result.
     *
     * ## Example
     * ```ts
     * const p = optional(null)
     * const r = p.mapOr("hello", () => "yes");
     * r === "hello"; // true
     *
     * const x = optional("yes")
     * const y = x.mapOr(10, () => 1000);
     * y === 1000; // true
     * ```
     * @param val
     * @param effect
     * @returns
     */
  mapOr<U>(val: U, effect: (val: T) => U) {
    if (this.isNone()) {
      return val;
    }

    const result = effect(this.value as T);
    return result;
  }

  /**
   * if wrapped value in this Option is null or undefined, execute gen(), return the result;
   * otherwise, execute effect(wrappedValue), return the result.
   *
   * ## Example
   * ```ts
   * const p = optional(null)
   * const v = p.mapOrElse(() => 10, () => 100);
   * v === 10; // true
   *
   * const x = optional("yes")
   * const y = x.mapOrElse(() => 10, () => 1000);
   * y === 1000; // true
   * ```
   * @param gen
   * @param effect
   * @returns
   */
  mapOrElse<U>(gen: () => U, effect: (val: T) => U) {
    if (this.isNone()) {
      return gen();
    }

    const result = effect(this.value as T);
    return result;
  }

  /**
   * if wrapped value in this Option is not null or not undefined,
   * execute effect(wrappedValue), then, return this Option itself
   * when result is true, otherwise return None Option.
   *
   * if wrapped value in this Option is null or undefined, return this Option itself.
   *
   * ## Example
   * ```ts
   * const p = optional(null)
   * const q = p.filter(_ => true);
   * p === q; // true
   *
   * const x = optional("yes")
   * const y = x.filter(v => v === "yes");
   * y === x; // true
   *
   * const z = x.filter(v => v === "no");
   * // z is wrapping value null, as a None Option
   * z.isNone(); // true
   * ```
   * @param effect
   * @returns
   */
  filter(effect: (val: T) => boolean): None | JZOption<T, K> {
    if (this.isNone()) {
      return this;
    }
    const result = effect(this.value as T);
    if (result) {
      return this;
    }
    return JZOption.of(null) as None;
  }

  /**
     * get the wrapped value in this Option;
     *
     * if wrapped value is undefined or null, an error will be thrown.
     *
     * ## Example
     * ```ts
     * const p = optional(199)
     * const r = p.unwrap();
     * r === 199; //true
     *
     * try {
     *   const x = optional(null)
     *   const y = x.unwrap();
     *   console.log("yes")
     * } catch(e) {
     *   console.log("no")
     * }
     * // print "no"
     * ```
     * @returns
     */
  unwrap() {
    if (this.isNone()) {
      throw new Error('unwrap on None');
    }

    return this.value as T;
  }

  /**
     * if wrapped value in this Option is undefined or null, return val;
     * otherwise, return the wrapped value.
     *
     * ## Example
     * ```ts
     * const p = optional(null)
     * const q = p.unwrapOr(100);
     * q === 100; // true
     *
     * const x = optional("yes");
     * const y = x.unwrapOr("not");
     * y === "yes"; // true
     *
     * ```
     * @param val
     * @returns
     */
  unwrapOr(val: T) {
    if (this.isSome()) return this.value as T;
    return val;
  }

  /**
   * return wrapped value if it is not null or not undefined;
   * otherwise, execute effect(), return the result.
   *
   * ## Example
   * ```ts
   * const p = optional(10)
   * const v = p.unwrapOrElse(() => 100);
   * v === 10;// true
   *
   * const q = optional(null)
   * const x = q.unwrapOrElse(() => 100);
   * x === 100;// true
   *
   * ```
   * @param effect
   * @returns
   */
  unwrapOrElse(effect: () => T) {
    if (this.isSome()) return this.value as T;
    return effect();
  }

  /**
   * if both this Option and val are Some, return a new Option
   * wrapping [wrappedValue, val.wrappedValue];
   *
   * otherwise, return None Option.
   *
   * ## Example
   * ```ts
   * const p = optional(null)
   * const v = p.zip(optional(10));
   * v.isNone(); // true
   *
   * const x = optional("yes")
   * const y = x.zip(optional(100));
   * y.isSome(); // true
   * // y is wrapping value ["yes", 100]
   * ```
   * @param val
   * @returns
   */
  zip<U>(val: JZOption<U>): None | JZOption<[T, U]> {
    if (this.isNone() || val.isNone()) {
      return JZOption.of(null);
    }

    const value = val.unwrap();
    return JZOption.of([this.value, value] as [T, U]);
  }

  /**
     * get the corresponding {@link OptionType}
     *
     * ## Example
     * ```ts
     * const p = optional("hel")
     * p.enum() === OptionType.Some; // true
     *
     * const q = optional(null)
     * q.enum() === OptionType.None; // true
     *
     * ```
     * @returns
     */
  enum() {
    if (this.isNone()) {
      return OptionType.None;
    }
    return OptionType.Some;
  }

  /**
     * only used with JZBoolean, look at an example:
     * ```ts
     * jzArrayEvery(arr, item => item > 10)
     *   .andThen(_ => { console.log("every item > 0")})
     *   .fail(_ => { console.log("every item")})
     *
     * ```
     * it's equal to:
     * ```ts
     * if (jzArrayEvery(arr, item => item > 10)) {
     *   console.log("every item > 0")
     * } else {
     *   console.log("every item")
     * }
     * ```
     * @param effect
     * @returns
     */
  fail<U>(effect: (val: K | undefined) => U) {
    if (this.value === none) {
      const result = effect(this.extraOnlyForJzBoolean);
      return JZOption.of(result);
    }
    return this;
  }
}

/**
 * create an Option
 * @param val
 * @returns
 */
export function optional<T>(val: T) {
  return JZOption.of(val) as JZOption<T, undefined>;
}

export function ctOptionalForJzBoolean<K>(wrappedValueOfJzBoolean: K) {
  return JZOption.of(none, wrappedValueOfJzBoolean);
}
