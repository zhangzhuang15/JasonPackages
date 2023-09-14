import type { Result } from "./result";
import type { RequestState } from "./state";

/**
 * An engine for sending request in the context of non-browser, e.g. Nodejs
 *
 * By default, we implemented it with Nodejs Http API
 */
export class DefaultNonBrowserRequestEngine {
  static fire(state: RequestState): Result {
    return {
      result: Promise.resolve(),
      cancelSwitch: () => {}
    };
  }
}
