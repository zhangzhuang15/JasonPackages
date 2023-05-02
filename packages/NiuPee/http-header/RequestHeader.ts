import { CommonHeader } from "./CommonHeader";
import type { CommonHeaderType } from "./CommonHeader";

/**
 * Request Header is the header exists in your request
 */
export class RequestHeader extends CommonHeader {
  /**
   * indicates which content types, expressed as MIME types, the client is able to understand.
   *
   * @example
   * `Accept: text/html, application/xhtml+xml, application/xml`
   * */
  static readonly Accept = "Accept" as const;

  /**
   * indicates the content encoding (usually a compression algorithm) that the client can understand.
   *
   * @example
   * `Accept-Encoding: deflate, gzip`
   */
  static readonly Accept_Encoding = "Accept-Encoding" as const;

  /**
   * indicates the natural language and locale that the client prefers.
   *
   * @example
   * `Accept-Language: fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5`
   */
  static readonly Accept_Language = "Accept-Language" as const;

  /**
   * is used by browsers when issuing a preflight request to let the server know which HTTP headers the client might send when the actual request is made
   *
   * @example
   * `Access-Control-Request-Headers: X-PINGOTHER, Content-Type`
   */
  static readonly Access_Control_Request_Headers =
    "Access-Control-Request-Headers" as const;

  /**
   * is used by browsers when issuing a preflight request, to let the server know which HTTP method will be used when the actual request is made.
   *
   * `preflight request` refer: https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request
   */
  static readonly Access_Control_Request_Method =
    "Access-Control-Request-Method" as const;

  /**
   *  be used to provide credentials that authenticate a user agent with a server, allowing access to a protected resource
   *
   *  refer: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization
   *
   *  @example
   * `Authorization: Basic <credentials>`, `<credentials>` means the real credential message
   */
  static readonly Authorization = "Authorization" as const;

  /**
   * contains stored HTTP cookies associated with the server.
   *
   * in browser, cookie is set by server response Header `Set-Cookie` or by javascript API;
   *
   * @example
   * `Cookie: name=jack; age=3; data=444443434`
   */
  static readonly Cookie = "Cookie" as const;

  /**
   * indicates expectations that need to be met by the server to handle the request successfully
   *
   * There is only one defined expectation: 100-continue
   *
   * refer: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expect
   *
   * @example
   * `Expect: 100-continue`
   */
  static readonly Expect = "Expect" as const;

  /**
   * contains information that may be added by reverse proxy servers (load balancers, CDNs, and so on) that would otherwise be altered or lost when proxy servers are involved in the path of the request.
   *
   * refer: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Forwarded
   *
   * @example
   * `Forwarded: for=192.0.2.60;proto=http;by=203.0.113.43`
   */
  static readonly Forwarded = "Forwarded" as const;

  /**
   * specifies the host and port number of the server to which the request is being sent
   *
   * @example
   * `Host: www.jack.com:8222`
   * `Host: www.jack.cn`  equals to `Host: www.jack.cn:80`
   */
  static readonly Host = "Host" as const;

  /**
   * server will check etag of resource if satisfied `If-Match`, if not, the resource
   * is considered as outdated, server will response 412, then client will fetch the
   * fresh resource again.
   *
   * it's related with ETag response Header.
   *
   * @example
   * `If-Match: "34435gfdsg", "432435fdsaf"`
   */
  static readonly If_Match = "If-Match" as const;

  /**
   * server will check `Last-Modified` of resource, we assume it is "Wed, 21 Oct 2015 07:28:00 GMT".
   *
   * if `If-Modified` is "Tue, 20 Oct 2015 07:28:00 GMT", the resource is outdated, the client has to
   * required fresh resource;
   *
   * if `If-Modified` is "Thu, 22 Oct 2015 07:28:00 GMT", server will response 304, tell client use
   * the local cache directly.
   *
   * `If-Modified-Since` can only be used with a GET or HEAD.
   *
   * @example
   * `If-Modified: Tue, 20 Oct 2015 07:28:00 GMT`
   */
  static readonly If_Modified = "If-Modified" as const;

  /**
   * TODO: a bit complex
   */
  static readonly If_None_Match = "If-None-Match" as const;

  /**
   * makes a range request conditional: if the condition is fulfilled, the range request is issued, and the server sends back a 206 Partial Content answer with the appropriate body. If the condition is not fulfilled, the full resource is sent back with a 200 OK status
   *
   * refer: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Range
   *
   * @example
   * `If-Range: "adff323432fa", "134225fsgrt5"`
   * `If-Range: Wed, 21 Oct 2015 07:28:00 GMT`
   */
  static readonly If_Range = "If-Range" as const;

  /**
   * makes the request for the resource conditional: the server will send the requested resource or accept it in the case of a POST or another non-safe method only if the resource has not been modified after the date specified by this HTTP header. If the resource has been modified after the specified date, the response will be a 412 Precondition Failed error.
   *
   * refer: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Unmodified-Since
   *
   * @example
   * `If-Unmodified-Since: Wed, 21 Oct 2015 07:28:00 GMT`
   */
  static readonly If_Unmodified_Since = "If-Unmodified-Since" as const;

  /**
   * is used with the TRACE method to limit the number of nodes (usually proxies) that request goes through
   *
   * @example
   * `Max-Forwards: 10`
   */
  static readonly Max_Forwards = "Max-Forwards" as const;

  /**
   * indicates the origin (scheme, hostname, and port) that caused the request. For example, if a user agent needs to request resources included in a page, or fetched by scripts that it executes, then the origin of the page may be included in the request.
   *
   * @example
   * `Origin: http://fdaf.com:4333`
   */
  static readonly Origin = "Origin" as const;

  /**
   * contains the credentials to authenticate a user agent to a proxy server, usually after the server has responded with a 407 Proxy Authentication Required status and the Proxy-Authenticate header.
   *
   * refer: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Proxy-Authorization
   *
   * @example
   * `Proxy-Authorization: Basic 324435eretwfsfdsggf`
   */
  static readonly Proxy_Authorization = "Proxy-Authorization" as const;

  /**
   * indicates the part of a document that the server should return.
   *
   * @example
   * `Range: bytes=100-3000`, 100-3000 means "100 bytes to 3000 bytes"
   */
  static readonly Range = "Range" as const;

  /**
   * contains the absolute or partial address from which a resource has been requested,
   * i.e. if you jump to Page url-B from Page url-A, and you request url-C resource at url-B,
   * the referer is url-A.
   *
   * The Referer header can contain an origin, path, and querystring, and may not contain URL fragments (i.e. #section) or username:password information.
   *
   * @example
   * `Referer: http://fds.com:3233/doc?m=hello`
   */
  static readonly Referer = "Referer" as const;

  /**
   * indicates the fetch request's destination.
   *
   * @example
   * `Sec-Fetch-Dest: audio`, audio means "wanna fetch an audio-type data"
   */
  static readonly Sec_Fetch_Dest = "Sec-Fetch-Dest" as const;

  /**
   * indicates the mode of the fetch request.
   *
   * @example
   * `Sec-Fetch-Mode: no-cors`
   */
  static readonly Sec_Fetch_Mode = "Sec-Fetch-Mode" as const;

  /**
   * indicates the relationship between a request initiator's origin and the origin of the requested resource
   *
   * @example
   * `Sec-Fetch-Site: cross-site`
   */
  static readonly Sec_Fetch_Site = "Sec-Fetch-Site" as const;

  /**
   * is only sent for requests initiated by user activation, and its value will always be ?1
   *
   * A server can use this header to identify whether a navigation request from a document, iframe, etc., was originated by the user.
   *
   * @example
   * `Sec-Fetch-User: ?1`
   */
  static readonly Sec_Fetch_User = "Sec-Fetch-User" as const;

  /**
   * indicates that the request was the result of a fetch() operation made during service worker navigation preloading
   *
   * refer: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Service-Worker-Navigation-Preload
   *
   * @example
   * `Service-Worker-Navigation-Preload: true`
   */
  static readonly Service_Worker_Navigation_Preload =
    "Service-Worker-Navigation-Preload" as const;

  /**
   * specifies the transfer encodings the user agent is willing to accept
   *
   * refer: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/TE
   *
   * @example
   * `TE: trailers`
   */
  static readonly TE = "TE" as const;

  /**
   * sends a signal to the server expressing the client's preference for an encrypted and authenticated response, and that it can successfully handle the upgrade-insecure-requests CSP directive.
   *
   * refer: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Upgrade-Insecure-Requests
   *
   * TODO: not understand
   */
  static readonly Upgrade_Insecure_Requests =
    "Upgrade-Insecure-Requests" as const;

  /**
   * a characteristic string that lets servers and network peers identify the application, operating system, vendor, and/or version of the requesting user agent.
   *
   * @example
   * `User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.2 Safari/605.1.15`
   */
  static readonly User_Agent = "User-Agent" as const;
}

export type RequestHeaderType =
  | (typeof RequestHeader)[Exclude<keyof typeof RequestHeader, "prototype">]
  | CommonHeaderType;
