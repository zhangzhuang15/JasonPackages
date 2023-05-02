/* eslint-disable max-classes-per-file */

import debug from "debug";
import { BrowserRequestHeaderCollectionEngine } from "../http-header-collection-engine/BrowserRequestHeaderCollectionEngine";
import type {
  RequestState,
  FetchState,
  Result
} from "../http-request-engine/BrowserRequestEngine";
import { BrowserRequestEngine } from "../http-request-engine/BrowserRequestEngine";
import { resolveXHRResponse } from "../http-response-resolver/XHRResponseResolver";
import { ResolvedResponse } from "../http-response-resolver";

const fetchDebugging = debug("BrowserRequestFetchFireState");

class BrowserRequestXHRFireState {
  private credential: RequestState["credential"] = false;

  /** ms */
  private timeout: RequestState["timeout"] = 0;

  private downloadTracker: RequestState["downloadTracker"];

  private uploadTracker: RequestState["uploadTracker"];

  private constructor(
    private method: RequestState["method"],
    private url: RequestState["url"],
    private headers: RequestState["headers"],
    private data: RequestState["data"]
  ) {}

  static create(
    method: RequestState["method"],
    url: RequestState["url"],
    headers: RequestState["headers"],
    data: RequestState["data"]
  ) {
    return new BrowserRequestXHRFireState(method, url, headers, data);
  }

  withCookie() {
    this.credential = true;
    return this;
  }

  withoutCookie() {
    this.credential = false;
    return this;
  }

  withTimeout(milliseconds: number) {
    this.timeout = milliseconds;
    return this;
  }

  onDownload(callback: RequestState["downloadTracker"]) {
    this.downloadTracker = callback;
    return this;
  }

  onUpload(callback: RequestState["uploadTracker"]) {
    this.uploadTracker = callback;
    return this;
  }

  /** make the real request, "siu" is inspired by CR7(C Ronaldo) */
  async siu(): Promise<Result<ResolvedResponse>> {
    const {
      method,
      url,
      headers,
      data,
      timeout,
      credential,
      downloadTracker,
      uploadTracker
    } = this;

    const state: RequestState = {
      method,
      url,
      headers,
      data,
      timeout,
      credential,
      downloadTracker,
      uploadTracker
    };

    const { result: resultPromise, cancelSwitch } =
      BrowserRequestEngine.fire_by_XHR(state);

    return {
      result: (resultPromise as Promise<XMLHttpRequest>).then(r =>
        resolveXHRResponse(r)
      ),
      cancelSwitch
    };
  }
}

class BrowserRequestFetchFireState {
  private credentials: FetchState["credentials"] = "omit";

  private cache: FetchState["cache"] = "default";

  private mode: FetchState["mode"] = "same-origin";

  private constructor(
    private method: FetchState["method"],
    private url: FetchState["url"],
    private headers: FetchState["headers"],
    private data: FetchState["body"]
  ) {}

  static create(
    method: FetchState["method"],
    url: FetchState["url"],
    headers: FetchState["headers"],
    data: FetchState["body"]
  ) {
    return new BrowserRequestFetchFireState(method, url, headers, data);
  }

  withoutCookie() {
    this.credentials = "omit";
    return this;
  }

  withCookieInSameOrigin() {
    this.credentials = "same-origin";
    return this;
  }

  withCookie() {
    this.credentials = "include";
    return this;
  }

  /**
   * make a request to fetch response, then don't update cache with the response
   */
  fetchResponseAndNotCacheIt() {
    this.cache = "no-store";
    return this;
  }

  /**
   * make a request to fetch response, then update cache with the response
   */
  fetchResponseAndUpdateCache() {
    this.cache = "reload";
    return this;
  }

  /**
   * - if cache is fresh, fetch response from cache;
   * - if cache is stale, make a conditional request,
   *   if the remote source not changed, fetch response from cache,
   *   if the remote source change, fetch response from remote,
   *   then update cache with the response;
   * - if no cache, make a request to fetch response, then update cache with the response;
   */
  fetchCachedResponseIfFreshCache() {
    this.cache = "default";
    return this;
  }

  /**
   * - if cache is fresh or stale, fetch response from cache;
   * - if no cache, make a request to fetch response, then update cache with the response;
   * @returns
   */
  fetchCachedResponseIfCached() {
    this.cache = "force-cache";
    return this;
  }

  /**
   * - if cache is fresh or stale, fetch response from cache;
   * - if no cache, return a response with 504 status;
   */
  fetchCachedResponseButThrow504IfNotCached() {
    this.cache = "only-if-cached";
    return this;
  }

  /**
   * - if no cache, make a request to fetch response, then update cache with the response;
   * - if cache is fresh or stale, make a conditional request,
   *   if the remote source not changed, fetch response from cache,
   *   if the remote source change, fetch response from remote,
   *   then update cache with the response;
   */
  askRemoteThenFetchCachedResponseIfFreshCache() {
    this.cache = "no-cache";
    return this;
  }

  /**
   * only allow to fetch remote source in same origin
   */
  fetchInSameOrigin() {
    this.mode = "same-origin";
    return this;
  }

  /**
   * only allow to fetch remote source if you follow CORS
   */
  fetchFollowCORS() {
    this.mode = "cors";
    return this;
  }

  /**
   * limit your request in these aspect:
   * - your request method must be HEAD, POST or GET;
   * - your request headers must be [simple headers](https://fetch.spec.whatwg.org/#simple-header);
   * - you cannot access properties of `Response` instance, but you can access methods of `Response` instance,
   *   in other words, you can load the remote source from the method(e.g. `Response.blob()`), but you cannot
   *   get more details from the properties(e.g. `Response.body`);
   */
  fetchFollowNonCORS() {
    this.mode = "no-cors";
    return this;
  }

  /** I don't know how to use "navigate" "websocket" mode, so I cannot provide api */
}

class BrowserRequestHeadersState extends BrowserRequestHeaderCollectionEngine {
  private constructor(
    private method: RequestState["method"],
    private url: RequestState["url"]
  ) {
    super(new Map());
  }

  static create(method: RequestState["method"], url: RequestState["url"]) {
    return new BrowserRequestHeadersState(method, url);
  }

  xhrFire(data: RequestState["data"]) {
    const { method, url } = this;
    const headers = this.collect();
    return BrowserRequestXHRFireState.create(method, url, headers, data);
  }

  fetchFire(data: FetchState["body"]) {
    const { method, url } = this;
    const headers = this.collect();
    return BrowserRequestFetchFireState.create(method, url, headers, data);
  }
}

class BrowserRequestUrlState {
  private query: [string, string][];

  private constructor(
    private method: RequestState["method"],
    private url: RequestState["url"]
  ) {
    this.query = Array.from(new URL(url).searchParams.entries());
  }

  static create(method: RequestState["method"], url: RequestState["url"]) {
    return new BrowserRequestUrlState(method, url);
  }

  /** API to modified query */

  /**
   * reset query
   * @param values
   *
   * @example
   * ```ts
   * const url = "http://pp.com/search?num=4"
   *
   * BrowserRequestManager
   *    .get(url)
   *    .resetQuery({ age: 15, num: 30});
   *
   * // the url will be "http://pp.com/search?age=15&num=30"
   * ```
   *
   * @example
   * ```ts
   * const url =  "http://pp.com/search?num=4"
   *
   * BrowserRequestManager
   *    .get(url)
   *    .resetQuery([ ["num", "23"], ["age", "14"], ["num", "45"] ]);
   *
   * // the url will be "http://pp.com/search?num=23&age=14&num=45"
   * ```
   */
  resetQuery(values: [string, string][] | Record<string, string>) {
    if (values instanceof Array) {
      this.query = values;
    } else {
      this.query = Array.from(Object.entries(values));
    }
    return this;
  }

  /**
   * set query, if query exists, replace it
   * @param values
   *
   * @example
   * ```ts
   * const url =  "http://pp.com/search?num=4";
   *
   * BrowserRequestManager
   *    .get(url)
   *    .replaceQuery({ age: 19, num: 10 });
   *
   * // url will be "http://pp.com/search?age=19&num=10"
   * ```
   *
   * @example
   * ```ts
   * const url = "http://pp.com/search?num=4&age=3&num=9";
   * BrowserRequestManager
   *    .get(url)
   *    .replaceQuery({ age: 3, num: 10});
   *
   * // url will be  "http://pp.com/search?age=3&num=10"
   * ```
   */
  replaceQuery(values: Record<string, string>) {
    this.query = this.query.filter(([key]) => !values[key]);
    this.query = this.query.concat(Array.from(Object.entries(values)));
    return this;
  }

  /**
   * add query no matter if it exists
   * @param values
   *
   * @example
   * ```ts
   * const url = "http://pp.com/search?num=4&age=3&num=9";
   * BrowserRequestManager
   *    .get(url)
   *    .addQuery({ num: 11, age: 45, fruit: "apple" });
   *
   * // url will be "http://pp.com/search?num=4&age=3&num=9&num=11&age=45&fruit=apple"
   * ```
   *
   * @example
   * ```ts
   * const url = "http://pp.com/search?num=4&age=3&num=9";
   * BrowserRequestManager
   *    .get(url)
   *    .addQuery([ ["num", "11"], ["fruit", "apple"], ["age", "11"] ]);
   *
   * // url will be "http://pp.com/search?num=4&age=3&num=9&num=11&fruit=apple&age=11"
   * ```
   */
  addQuery(values: [string, string][] | Record<string, string>) {
    if (values instanceof Array) {
      this.query = this.query.concat(values);
    } else {
      this.query = this.query.concat(Array.from(Object.entries(values)));
    }
    return this;
  }

  readyForHeaders() {
    const { origin, pathname, hash } = new URL(this.url);
    const query = this.query.map(([key, value]) => `${key}=${value}`).join("&");
    const url = `${origin}${pathname}${query === "" ? query : `?${query}`}${
      hash === "" ? hash : `#${hash}`
    }`;

    return BrowserRequestHeadersState.create(this.method, url);
  }
}

export class BrowserRequestManager {
  static get(url: RequestState["url"]) {
    return BrowserRequestUrlState.create("GET", url);
  }

  static post(url: RequestState["url"]) {
    return BrowserRequestUrlState.create("POST", url);
  }

  static head(url: RequestState["url"]) {
    return BrowserRequestUrlState.create("HEAD", url);
  }

  static put(url: RequestState["url"]) {
    return BrowserRequestUrlState.create("PUT", url);
  }

  static options(url: RequestState["url"]) {
    return BrowserRequestUrlState.create("OPTIONS", url);
  }
}
