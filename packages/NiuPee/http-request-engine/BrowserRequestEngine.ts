export interface RequestState {
  url: string;
  headers: Map<string, string>;
  data: Document | XMLHttpRequestBodyInit | null | undefined;
  method: "GET" | "POST" | "OPTIONS" | "PUT" | "HEAD";
  /** ms */
  timeout?: number;
  credential?: boolean;
  downloadTracker?: (event: ProgressEvent) => void;
  uploadTracker?: (event: ProgressEvent) => void;
}

export interface FetchState {
  url: RequestState["url"];
  method?: RequestState["method"];
  headers?: RequestState["headers"];
  body?: BodyInit | null | undefined;
  credentials?: "omit" | "include" | "same-origin";
  cache?:
    | "default"
    | "no-store"
    | "reload"
    | "no-cache"
    | "force-cache"
    | "only-if-cached"
    | "navigate"
    | "websocket";
  mode?: "cors" | "no-cors" | "same-origin";
  redirect?: "follow" | "error" | "manual";
  referrerPolicy?:
    | "no-referrer"
    | "no-referrer-when-downgrade"
    | "origin"
    | "origin-when-cross-origin"
    | "unsafe-url"
    | "same-origin"
    | "strict-origin"
    | "strict-origin-when-cross-origin";
}

export interface Result<T = unknown> {
  result: Promise<T>;
  cancelSwitch: (v: any) => void;
}

export class BrowserRequestEngine {
  /**
   * send a request by XMLHttpRequest API
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

    request.send(data);

    return {
      result,
      cancelSwitch: switcher.cancel
    };
  }

  /**
   * send a request by Fetch API
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
        resultSwitcher.ok(response);
      })
      .catch(error => {
        resultSwitcher.fail({ type: "fetch-error", event: error });
      });

    return {
      result,
      cancelSwitch: cancel
    };
  }
}
