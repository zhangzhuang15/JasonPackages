import { RequestHeader } from "../http-header";
import {
  Cache_Control_Suggest,
  Content_Disposition_Suggest,
  Content_Encoding_Suggest,
  Popular_MIMEType
} from "../http-header/SuggestHeaderValue";

/**
 * BrowserRequestHeaderCollectionEngine is responsible for
 * set or modify request header in the context of browser,
 * and it must finally provide a request header collection with
 * the request engine.
 *
 * As for a package user, you don't need to touch with
 * this class, it works only for this package developers.
 */
export class BrowserRequestHeaderCollectionEngine {
  constructor(private requestHeaderState: Map<string, string>) {}

  /**
   * set `Accept` header suggested value
   *
   * @param value `Accept` header value we suggested to you
   *
   * @example
   *
   * ```ts
   * engine.acceptSuggest(Popular_MiMEType.pdf);
   * ```
   */
  protected acceptSuggest(value: Popular_MIMEType) {
    this.requestHeaderState.set(RequestHeader.Accept, value);
    return this;
  }

  /**
   * set `Accept` header value
   * @param value `Accept` header value
   *
   * @example
   *
   * ```ts
   * engine.accept('text/html');
   * ```
   */
  protected accept(value: string) {
    this.requestHeaderState.set(RequestHeader.Accept, value);
    return this;
  }

  /**
   * set `Accept-Language` header value
   *
   * which value you can set, visit this [page](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language)
   * @param value
   *
   * @example
   *
   * ```ts
   * engine.acceptLanguage('fr-CH');
   * ```
   */
  protected acceptLanguage(value: string) {
    this.requestHeaderState.set(RequestHeader.Accept_Language, value);
    return this;
  }

  /**
   * set `Authorization` header value
   *
   * which value you can set, visit this [page](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization)
   * @param value
   */
  protected authorization(value: string) {
    this.requestHeaderState.set(RequestHeader.Authorization, value);
    return this;
  }

  /**
   * set `Forwarded` header value
   *
   * which value you can set, visit this [page](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Forwarded)
   * @param value
   *
   * @example
   *
   * ```ts
   * engine.forwarded('for=192.0.0.4;proto=http;by=200.3.221.34');
   * ```
   */
  protected forwarded(value: string) {
    this.requestHeaderState.set(RequestHeader.Forwarded, value);
    return this;
  }

  /**
   * set `If-Match` header value
   * @param etag `ETag` header value from response header
   */
  protected ifMatch(etag: string) {
    this.requestHeaderState.set(RequestHeader.If_Match, etag);
    return this;
  }

  /**
   * set `If-Modified` header value
   * @param date `Last-Modified` header value from response header,
   * and its format is `Tue, 20 Oct 2015 07:28:00 GMT`
   *
   * @example
   *
   * ```ts
   * engine.ifModified('Tue, 20 Oct 2015 07:28:00 GMT');
   * ```
   */
  protected ifModified(date: string) {
    this.requestHeaderState.set(RequestHeader.If_Modified, date);
    return this;
  }

  /**
   * set `If-None-Match` header value
   * @param value
   *
   * TODO: waiting for improve
   */
  protected ifNoneMatch(value: string) {
    this.requestHeaderState.set(RequestHeader.If_None_Match, value);
    return this;
  }

  /**
   * set `If-Range` header value
   * @param value
   *
   * @example
   *
   * ```ts
   * engine.ifRange('Tue, 20 Oct 2015 07:28:00 GMT');
   * engine.ifRange('"adfdafdfaf123", "32434fdagfdg"');
   * ```
   */
  protected ifRange(value: string) {
    this.requestHeaderState.set(RequestHeader.If_Range, value);
    return this;
  }

  /**
   * set `If-Unmodified-Since` header value
   * @param date its format is as 'Tue, 20 Oct 2015 07:28:00 GMT'
   *
   * @example
   * ```ts
   * engine.ifUnmodifiedSince('Tue, 20 Oct 2015 07:28:00 GMT');
   * ```
   */
  protected ifUnmodifiedSince(date: string) {
    this.requestHeaderState.set(RequestHeader.If_Unmodified_Since, date);
    return this;
  }

  /**
   * set `Max-Forwards` header value
   * @param value
   *
   * @example
   * ```ts
   * engine.maxForwards("10");
   * ```
   */
  protected maxForwards(value: string) {
    this.requestHeaderState.set(RequestHeader.Max_Forwards, value);
    return this;
  }

  /**
   * set `Range` header value
   * @param value
   *
   * @example
   * ```ts
   * const engine = new BrowserRequestHeaderCollectionEngine(new Map());
   * engine.range('bytes=100-3000');
   * ```
   */
  protected range(value: string) {
    this.requestHeaderState.set(RequestHeader.Range, value);
    return this;
  }

  /**
   * set `User-Agent` header value
   * @param value
   */
  protected userAgent(value: string) {
    this.requestHeaderState.set(RequestHeader.User_Agent, value);
    return this;
  }

  /**
   * set `Cache-Control` header value as we suggested to you
   * @param value
   *
   * @example
   * ```ts
   * const engine = new BrowserRequestHeaderCollectionEngine(new Map());
   * engine.cacheControlSuggest(Cache_Control_Suggest.max_age_400);
   * ```
   */
  protected cacheControlSuggest(value: Cache_Control_Suggest) {
    this.requestHeaderState.set(RequestHeader.Cache_Control, value);
    return this;
  }

  /**
   * set `Cache-Control` header value
   * @param value
   *
   * @example
   * ```ts
   * const engine = new BrowserRequestHeaderCollectionEngine(new Map());
   * engine.cacheControl('no-cache');
   * ```
   */
  protected cacheControl(value: string) {
    this.requestHeaderState.set(RequestHeader.Cache_Control, value);
    return this;
  }

  /**
   * set `Content-Disposition` header value as we suggested to you
   * @param value
   *
   * @param
   * ```ts
   * engine.contentDispositionSuggest(Content_Disposition_Suggest.inline);
   * ```
   */
  protected contentDispositionSuggest(value: Content_Disposition_Suggest) {
    this.requestHeaderState.set(RequestHeader.Content_Disposition, value);
    return this;
  }

  /**
   * set `Content-Disposition` header value
   * @param value
   *
   * @example
   * ```ts
   * engine.contentDisposition('form-data; name="Fruit"; filename="orange.jpeg"');
   * ```
   */
  protected contentDisposition(value: string) {
    this.requestHeaderState.set(RequestHeader.Content_Disposition, value);
    return this;
  }

  /**
   * set `Content-Encoding` header value as we suggested to you
   * @param value
   *
   * @example
   * ```ts
   * engine.contentEncodingSuggest(Content_Encoding_Suggest.gzip);
   * ```
   */
  protected contentEncodingSuggest(value: Content_Encoding_Suggest) {
    this.requestHeaderState.set(RequestHeader.Content_Encoding, value);
    return this;
  }

  /**
   * set `Content-Encoding` header value
   * which value you can set, visit [page]( https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding)
   * @param value
   *
   * @example
   * ```ts
   * engine.contentEncoding("br,gzip");
   * ```
   */
  protected contentEncoding(value: string) {
    this.requestHeaderState.set(RequestHeader.Content_Encoding, value);
    return this;
  }

  /**
   * set `Content-Language` header value
   * @param value
   *
   * @example
   * ```ts
   * engine.contentLanguage("en-US");
   * ```
   */
  protected contentLanguage(value: string) {
    this.requestHeaderState.set(RequestHeader.Content_Language, value);
    return this;
  }

  /**
   * set `Content-Location` header value
   *
   * @param value
   *
   * @example
   * ```ts
   * engine.contentLocation("/images/hi.png");
   * ```
   */
  protected contentLocation(value: string) {
    this.requestHeaderState.set(RequestHeader.Content_Location, value);
    return this;
  }

  /**
   * set `Content-Type` header value as we suggested to you
   * @param value
   *
   * @example
   * ```ts
   * engine.contentTypeSuggest(Popular_MIMEType.ppt);
   * ```
   */
  protected contentTypeSuggest(value: Popular_MIMEType) {
    this.requestHeaderState.set(RequestHeader.Content_Type, value);
    return this;
  }

  /**
   * set `Content-Type` header value
   * @param value
   *
   * @example
   * ```ts
   * engine.contentType("text/html; charset=utf-8");
   * ```
   */
  protected contentType(value: string) {
    this.requestHeaderState.set(RequestHeader.Content_Type, value);
    return this;
  }

  /**
   * set `Last-Modified` header value
   *
   * usually set by server, when client makes a proxy, this header might be needed.
   * @param date its format as "Wed, 21 Oct 2015 07:28:00 GMT"
   *
   * @example
   * ```ts
   * engine.lastModified("Wed, 21 Oct 2015 07:28:00 GMT");
   * ```
   */
  protected lastModified(date: string) {
    this.requestHeaderState.set(RequestHeader.Last_Modified, date);
    return this;
  }

  /**
   * set headers if you don't need our api suggest.
   * @param headers
   *
   * @example
   * ```ts
   * engine.requestHeaders({
   *  "Content-Type": "text/html",
   *  "Cache-Control": "no-store"
   * });
   * ```
   */
  protected requestHeaders(headers: Record<string, string>) {
    Object.keys(headers).forEach(key => {
      this.requestHeaderState.set(key, headers[key]);
    });
    return this;
  }

  /**
   * get the final collection of request header
   */
  protected collect(): Map<string, string> {
    return JSON.parse(JSON.stringify(this.requestHeaderState));
  }

  /**
   * deep clone for this class
   */
  private clone() {
    const state = JSON.parse(JSON.stringify(this.requestHeaderState));
    return new BrowserRequestHeaderCollectionEngine(state);
  }
}
