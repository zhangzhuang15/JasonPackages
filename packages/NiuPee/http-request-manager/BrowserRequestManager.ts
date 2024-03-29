/* eslint-disable max-classes-per-file */

import { BrowserRequestHeaderCollectionEngine } from "@/http-header-collection-engine/BrowserRequestHeaderCollectionEngine";
import type { RequestState, FetchState } from "@/http-request-engine/state";
import type { Result } from "@/http-request-engine/result";
import type { Engine } from "@/http-request-engine/engine";
import { BrowserRequestEngine } from "@/http-request-engine/BrowserRequestEngine";
import {
  resolveXHRError,
  resolveXHRResponse
} from "@/http-response-resolver/XHRResponseResolver";
import { ResolvedResponse } from "@/http-response-resolver";
import {
  resolveFetchError,
  resolveFetchResponse
} from "@/http-response-resolver/FetchResponseResolver";
import { DefaultNonBrowserRequestEngine } from "@/http-request-engine/NonBrowserRequestEngine";

// in this part, we use state mode to clarify every step in a request.
//
// RequestUrlState only allows you to change the query;
//
// RequestHeadersState only allows you to change the headers and body data;
//
// BrowserRequestXHRFireState will dispatch the request by XMLHttpRequest API and
// return the response to you;
//
// BrowserRequestFetchFireState will dispatch the request by fetch API and return
// then response to you;

class BrowserRequestXHRFireState {
  private credential: RequestState["credential"] = false;

  /** ms */
  private timeout: RequestState["timeout"] = 0;

  /**
   * we request users to make sure which format of response they expect.
   * we don't analysis the format from the header field  such as "Content-Type",
   * the reason is easy:
   * for people who use connect, a third-party package, which takes "Content-Type: application/connect+json",
   * but the response is raw binary format.
   *
   * default: response is string format.
   */
  private responseType: RequestState["responseType"] = "";

  private downloadTracker: RequestState["downloadTracker"];

  private uploadTracker: RequestState["uploadTracker"];

  private requestEngine: Engine = BrowserRequestEngine.fire_by_XHR;

  protected constructor(
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

  protected getRequestState(): RequestState {
    const {
      method,
      url,
      headers,
      data,
      timeout,
      credential,
      responseType,
      downloadTracker,
      uploadTracker
    } = this;

    return {
      method,
      url,
      headers,
      data,
      timeout,
      credential,
      responseType,
      downloadTracker,
      uploadTracker
    };
  }

  useRequestEngine(requestEngine: Engine) {
    this.requestEngine = requestEngine;
    return this;
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

  /**
   * expect response as json format
   */
  expectJson() {
    this.responseType = "json";
    return this;
  }

  /**
   * expect response as raw binary format
   */
  expectRaw() {
    this.responseType = "arraybuffer";
    return this;
  }

  /**
   * expect response as blob format
   */
  expectBlob() {
    this.responseType = "blob";
    return this;
  }

  /**
   * expect response as text format
   */
  expectText() {
    this.responseType = "text";
    return this;
  }

  /**
   * expect response as document format
   */
  expectDocument() {
    this.responseType = "document";
    return this;
  }

  /** make the real request, "siu" is inspired by CR7(C Ronaldo) */
  async siu(): Promise<Result<ResolvedResponse<XMLHttpRequest["response"]>>> {
    const state: RequestState = this.getRequestState();

    const { result: resultPromise, cancelSwitch } = this.requestEngine(state);

    return {
      result: (resultPromise as Promise<XMLHttpRequest>)
        .then(r => resolveXHRResponse(r))
        .catch(error => {
          // this is internal development error resolve
          resolveXHRError(error);

          // external user error resolve
          return Promise.reject(error);
        }),
      cancelSwitch
    };
  }
}

class BrowserRequestFetchFireState {
  private credentials: FetchState["credentials"] = "omit";

  private cache: FetchState["cache"] = "default";

  private mode: FetchState["mode"] = "same-origin";

  private referrerPolicy: FetchState["referrerPolicy"] = "no-referrer";

  private responseType: FetchState["responseType"] = "string";

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

  /** I don't know how to use "follow" "error" "manual" these redirect optional value, so I cannot provide api */

  /**
   * make a request without `Referer` Header
   */
  omitReferer() {
    this.referrerPolicy = "no-referrer";
    return this;
  }

  /**
   * make a request with `Referer` Header which takes value from origin of current website page.
   * e.g. if you make a request at `http://hello.com/pick`, the `Referer` will be `http://hello.com`
   */
  originReferer() {
    this.referrerPolicy = "origin";
    return this;
  }

  /**
   * make a request with `Referer` Header which takes value from origin,path,query of current website page.
   * e.g. if you make a request at `http://hello.com/pick?name=jack#page`, the `Referer` will be `http://hello.com/pick?name=jack`
   *
   * note that if you make a cross-origin request, `Referer` Header will be omitted!
   */
  sameOriginReferer() {
    this.referrerPolicy = "same-origin";
    return this;
  }

  /**
   * only when you make a http\https request at http\https website, `Referer` Header will be sent,
   * and its value is the origin of http\https website.
   * e.g. you send a http request at `http://hello.com/pick?name=jack#page`, the `Referer` will be `http://hello.com`
   */
  strictOriginReferer() {
    this.referrerPolicy = "strict-origin";
    return this;
  }

  /**
   * if you make a http\https request at http\https website, `Referer` Header will be the origin, path,query of the current
   * website page.
   * e.g. you send a http request at `http://hello.com/pick?name=jack#page`, the `Referer` will be `http://hello.com`
   *
   * if you make a http request at https website, `Referer` Header will be the origin of the current website page.
   * e.g. you send a http request at `https://hello.com/pick?name=jack#page`, the `Referer` will be `https://hello.com`
   */
  originWhenCrossOriginReferer() {
    this.referrerPolicy = "origin-when-cross-origin";
    return this;
  }

  /**
   * if you make a http\file request at https website, `Referer` Header will be omitted;
   * if you make a http\https request at htt\https website, `Referer` Header will be the origin,
   * path,query of the current website page.
   * e.g. you send a http request at `http://hello.com/pick?name=jack#page`, the `Referer` Header will be `http://hello.com/pick?name=jack`
   */
  noRefererWhenDowngrade() {
    this.referrerPolicy = "no-referrer-when-downgrade";
    return this;
  }

  /**
   * when you send a http request at https website, `Referer` Header will be omitted;
   *
   * otherwise:
   * - when you send a same-origin request, `Referer` Header will be the origin,path,query of the current website page;
   * - when you send a cross-origin request, `Referer` Header will be the origin of the current website page;
   *
   * e.g.
   * if you send `http://hello.com/pick?age=4#page` at `http://hello.com/pick?name=jack`, the `Referer` Header
   * will be `http://hello.com/pick?age=4`;
   *
   * e.g.
   * if you send `http://matric.com/pick?age=10#page` at `http://hello.com/pick?name=jack`, the `Referer` Header
   * will be `http://matric.com`
   *
   */
  strictOriginWhenCrossOrigin() {
    this.referrerPolicy = "strict-origin-when-cross-origin";
    return this;
  }

  /**
   * expect response in json format
   */
  expectJson() {
    this.responseType = "json";
    return this;
  }

  /**
   * expect response in blob format
   * @returns
   */
  expectBlob() {
    this.responseType = "blob";
    return this;
  }

  /**
   * expect response in text format
   */
  expectText() {
    this.responseType = "string";
    return this;
  }

  /**
   * expect response in raw binary format
   */
  expectRaw() {
    this.responseType = "arraybuffer";
    return this;
  }

  /** make the real request, "siu" is inspired by CR7(C Ronaldo) */
  async siu(): Promise<Result<ResolvedResponse>> {
    const {
      url,
      method,
      mode,
      cache,
      referrerPolicy,
      credentials,
      headers,
      responseType,
      data
    } = this;

    const state: FetchState = {
      url,
      method,
      mode,
      cache,
      referrerPolicy,
      credentials,
      headers,
      responseType,
      body: data
    };

    const { result, cancelSwitch } = BrowserRequestEngine.fire_by_Fetch(state);

    return {
      result: (result as Promise<Response>)
        .then(r => resolveFetchResponse(r, responseType))
        .catch(error => {
          resolveFetchError(error);
          return Promise.reject(error);
        }),
      cancelSwitch
    };
  }
}

/**
 * 采用继承的方式，而不是采用组合的方式，是因为组合的方式没办法获取到 BrowserRequestHeaderCollectionEngine
 * 各个成员方法的智能提示
 */
class RequestHeadersState extends BrowserRequestHeaderCollectionEngine {
  private constructor(
    private method: RequestState["method"],
    private url: RequestState["url"]
  ) {
    super(new Map());
  }

  static create(method: RequestState["method"], url: RequestState["url"]) {
    return new RequestHeadersState(method, url);
  }

  /**
   * be ready for sending a request driven by XMLHttpRequest API.
   * @param data the body data in your http request.
   */
  xhrFire(data: RequestState["data"]) {
    const { method, url } = this;
    const headers = this.collect();
    return BrowserRequestXHRFireState.create(method, url, headers, data);
  }

  /**
   * be ready for sending a request driven by fetch API.
   */
  fetchFire(data: FetchState["body"]) {
    const { method, url } = this;
    const headers = this.collect();
    return BrowserRequestFetchFireState.create(method, url, headers, data);
  }

  nonBrowserFire(data: any) {
    const { method, url } = this;
    const headers = this.collect();
    return BrowserRequestXHRFireState.create(
      method,
      url,
      headers,
      data
    ).useRequestEngine(DefaultNonBrowserRequestEngine.fire);
  }
}

class RequestUrlState {
  private query: [string, string][];

  private constructor(
    private method: RequestState["method"],
    private url: RequestState["url"]
  ) {
    this.query = Array.from(new URL(url).searchParams.entries());
  }

  static create(method: RequestState["method"], url: RequestState["url"]) {
    return new RequestUrlState(method, url);
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

    return RequestHeadersState.create(this.method, url);
  }
}

export class BrowserRequestManager {
  static get(url: RequestState["url"]) {
    return RequestUrlState.create("GET", url);
  }

  static post(url: RequestState["url"]) {
    return RequestUrlState.create("POST", url);
  }

  static head(url: RequestState["url"]) {
    return RequestUrlState.create("HEAD", url);
  }

  static put(url: RequestState["url"]) {
    return RequestUrlState.create("PUT", url);
  }

  static options(url: RequestState["url"]) {
    return RequestUrlState.create("OPTIONS", url);
  }
}
