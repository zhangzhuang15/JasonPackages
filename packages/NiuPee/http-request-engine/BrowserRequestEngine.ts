import type { RequestState, FetchState } from "./state";
import type { Result } from "./result";

export class BrowserRequestEngine {
  /**
   * send a request by XMLHttpRequest API
   *
   * after some research, XMLHttpRequest supports http2 without need to set "HTTP2-Settings"
   */
  static fire_by_XHR(state: RequestState): Result {
    const { url, data, method, headers } = state;

    const request = new XMLHttpRequest();
    const urlObj = new URL(url);

    // we can support async=false, but it might be not good for performance,so we give up it.
    const async = true;
    request.open(method, urlObj, async);

    try {
      headers.forEach((value, key) => {
        request.setRequestHeader(key, value);
      });
    } catch (error) {
      return {
        // eslint-disable-next-line prefer-promise-reject-errors
        result: Promise.reject({ type: "not-send", event: error }),
        cancelSwitch: () => {}
      };
    }

    const switcher = { cancel: (v: unknown) => {} };
    new Promise(resolve => {
      switcher.cancel = resolve;
    }).then(_ => {
      // the response not comes back, we could do abort
      // refer: https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/readyState
      if (request.readyState < XMLHttpRequest.HEADERS_RECEIVED) {
        request.abort();
      }
    });

    const resultSwitcher = {
      ok: (v: unknown) => {},
      fail: (v: unknown) => {}
    };
    const result = new Promise<unknown>((resolve, reject) => {
      resultSwitcher.ok = resolve;
      resultSwitcher.fail = reject;
    });

    /** body data is loading, response headers are completed */
    request.onprogress = event => {
      state.downloadTracker?.(event);
      state.uploadTracker?.(event);
    };

    /** body data is completed */
    request.onload = () => {
      resultSwitcher.ok(request);
    };

    request.onerror = event => {
      resultSwitcher.fail({ type: "onerror", event });
    };

    /** request is out of time */
    request.ontimeout = event => {
      resultSwitcher.fail({ type: "ontimeout", event });
    };

    // millisecond
    request.timeout = state.timeout ?? 0;

    /* whether to take with cookie */
    request.withCredentials = state.credential ?? false;

    request.responseType = state.responseType;

    request.send(data);

    return {
      result,
      cancelSwitch: switcher.cancel
    };
  }

  /**
   * send a request by Fetch API
   *
   * after some research, Fetch supports http2 without need to set "HTTP2-Settings"
   */
  static fire_by_Fetch(state: FetchState): Result {
    const { url, body, method, headers } = state;

    const resultSwitcher = {
      ok: (v: unknown) => {},
      fail: (v: unknown) => {}
    };
    const result = new Promise<unknown>((resolve, reject) => {
      resultSwitcher.ok = resolve;
      resultSwitcher.fail = reject;
    });

    const controller = new AbortController();
    const { signal } = controller;
    const cancel = controller.abort;

    const fetched = fetch(url, {
      method,
      headers: headers ? new Headers(Array.from(headers.entries())) : headers,
      body,
      credentials: state.credentials,
      signal
    });

    fetched
      .then(response => {
        if (response.ok) {
          resultSwitcher.ok(response);
        } else {
          // response status is not in [200, 300)
          resultSwitcher.fail({ type: "fetch-http-error", event: response });
        }
      })
      .catch(error => {
        // fetch only reject when network error is encountered
        resultSwitcher.fail({ type: "fetch-network-error", event: error });
      });

    return {
      result,
      cancelSwitch: cancel
    };
  }
}
