import {
  JZOption, None, optional, ctOptionalForJzBoolean, NoneSymbol,
} from './jz-option';

export class JZBoolean<T> {
  private constructor(
    private value: T,
    private state: boolean,
  ) {}

  take() {
    return this.value;
  }

  /**
     *
     * @param effect
     * @returns
     */
  andThen<M>(effect: (val: T) => M): JZOption<M> | None | JZOption<NoneSymbol, T> {
    if (this.state) {
      const result = effect(this.value);
      return optional(result);
    }

    return ctOptionalForJzBoolean(this.value);
  }

  /**
     *
     * @param effect
     * @returns
     */
  orThen<M>(effect: (val: T) => M): JZOption<M> | None | JZOption<NoneSymbol, T> {
    if (!this.state) {
      const result = effect(this.value);
      return optional(result);
    }

    return ctOptionalForJzBoolean(this.value);
  }

  static of<M>(val: M, state: boolean): JZBoolean<M> {
    return new JZBoolean(val, state);
  }
}

/**
 * create jzBoolean, take state as inital state, take initValue
 * as initial wrapped value, then you can use chainable expression
 * to do some logic operations.
 *
 * ## Example
 * ```ts
 * const p = ctBoolean(false, 100)
 * p
 *  .andThen(_ => {
 *   console.log("yes")
 *  })
 *  .fail(_ => {
 *   console.log("no")
 *  })
 * // print "no"
 * ```
 *
 * @param state
 * @param initValue
 * @returns
 */
export function ctBoolean<M>(state: boolean, initValue: M) {
  return JZBoolean.of(initValue, state);
}
