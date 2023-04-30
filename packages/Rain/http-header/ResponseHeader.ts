import { CommonHeader } from "./CommonHeader";
import type { CommonHeaderType } from "./CommonHeader";

/**
 * response header is the header exists in the response you get.
 */
export class ResponseHeader extends CommonHeader {
  /**
   * advertises which media-type the server is able to understand in a PATCH request
   *
   * @example
   * `Accept-Patch: application/example, text/example`
   * */
  static readonly Accept_Patch = "Accept-Patch" as const;

  /**
   * advertises which media types are accepted by the server for HTTP post requests
   *
   * @example
   * `Accept-Post: image/webp`
   * */
  static readonly Accept_Post = "Accept-Post" as const;

  /**
   * is a marker used by the server to advertise its support for partial requests from the client for file downloads
   *
   * @example
   * `Accept-Ranges: bytes`
   */
  static readonly Accept_Ranges = "Accept-Ranges" as const;

  /**
   * tells browsers whether to expose the response to the frontend JavaScript code when the request's credentials mode (Request.credentials) is include.
   *
   * @example
   * `Access-Control-Allow-Credentials: true`
   */
  static readonly Access_Control_Allow_Credentials =
    "Access-Control-Allow-Credentials" as const;

  /**
   * is used in response to a preflight request which includes the Access-Control-Request-Headers to indicate which HTTP headers can be used during the actual request.
   *
   * `preflight request` refer: https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request
   *
   * @example
   * `Access-Control-Allow-Headers: Origin, Refer, Cookies`
   */
  static readonly Access_Control_Allow_Headers =
    "Access-Control-Allow-Headers" as const;

  /**
   * specifies one or more methods allowed when accessing a resource in response to a preflight request.
   *
   * `preflight request` refer: https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request
   *
   * @example
   * `Access-Control-Allow-Methods: POST, GET`
   */
  static readonly Access_Control_Allow_Methods =
    "Access-Control-Allow-Methods" as const;

  /**
   * indicates whether the response can be shared with requesting code from the given origin header
   *
   * @example
   * `Access-Control-Allow-Origin: *`
   */
  static readonly Access_Control_Allow_Origin =
    "Access-Control-Allow-Origin" as const;

  /**
   *  indicate which response headers should be made available to scripts running in the browser, in response to a cross-origin request.
   *
   *  Only the CORS-safelisted response headers are exposed by default
   *
   * `CORS-safelisted response` refer: https://developer.mozilla.org/en-US/docs/Glossary/CORS-safelisted_response_header
   *
   *  @example
   * `Access-Control-Expose-Headers: Content-Encoding, Kuma-Revision`
   */
  static readonly Access_Control_Expose_Headers =
    "Access-Control-Expose-Headers" as const;

  /**
   * indicates how long the results of a preflight request (that is the information contained in the Access-Control-Allow-Methods and Access-Control-Allow-Headers headers) can be cached
   *
   * @example
   * `Access-Control-Max-Age: 60`,  60 means "60 seconds"
   */
  static readonly Access_Control_Max_Age = "Access-Control-Max-Age" as const;

  /**
   * contains the time in seconds the object was in a proxy cache.
   *
   * @example
   * `Age: 24`
   */
  static readonly Age = "Age" as const;

  /**
   * lists the set of methods supported by a resource.
   *
   * @example
   * `Allow: GET, POST, HEAD`
   */
  static readonly Allow = "Allow" as const;

  /**
   * indicates where in a full body message a partial message belongs
   *
   * it's very popular when server sends some raw binary data(.mp4, .mp3, .word) to client.
   *
   * @example
   * `Content-Range: bytes 200-1000/67589`
   *
   * - 67589 means "total content  is 67589 bytes"
   * - 200-1000 means "this content is the part of total content which is located in 200 bytes to 1000 bytes"
   */
  static readonly Content_Range = "Content-Range" as const;

  /**
   * configures embedding cross-origin resources into the document.
   *
   * refer: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy
   *
   * TODO: not understand
   * @example
   * `Cross-Origin-Embedder-Policy: require-corp`
   */
  static readonly Cross_Origin_Embedder_Policy =
    "Cross-Origin-Embedder-Policy" as const;

  /**
   * allows you to ensure a top-level document does not share a browsing context group with cross-origin documents
   *
   * refer: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy
   *
   * TODO: not understand
   * @example
   * `Cross-Origin-Opener-Policy: unsafe-none`
   */
  static readonly Cross_Origin_Opener_Policy =
    "Cross-Origin-Opener-Policy" as const;

  /**
   * conveys a desire that the browser blocks no-cors cross-origin/cross-site requests to the given resource
   *
   * refer: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Resource-Policy
   *
   * TODO: not understand
   *
   * @example
   * `Cross-Origin-Resource-Policy: same-origin`
   */
  static readonly Cross_Origin_Resource_Policy =
    "Cross-Origin-Resource-Policy" as const;

  /**
   * provides a digest of the selected representation of the requested resource.
   * It can be used to verify that the representation data has not been modified during transmission.
   *
   * refer: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Digest
   *
   * @example
   * `Digest: sha-256=X48E9qOokqqrvdts8nOJRJN3OWDUoyWxBf7kbu9DBPE=`
   */
  static readonly Digest = "Digest" as const;

  /**
   * is an identifier for a specific version of a resource.
   *
   * if the resource at a given URL changes, a new Etag value must be generated.
   *
   * it's related with cache control.
   *
   * @example
   * `ETag: "dafaffeee32343425425"`
   */
  static readonly ETag = "ETag" as const;

  /**
   * contains the date/time after which the response is considered expired.
   *
   * @example
   * `Expires: Wed, 21 Oct 2015 07:28:00 GMT`
   */
  static readonly Expires = "Expires" as const;

  /**
   * indicates the URL to redirect a page to. It only provides a meaning when served with a 3xx (redirection) or 201 (created) status response
   *
   * @example
   * `Location: /hello.html`
   * `Location: http://fdfdad.com/hello.html`
   */
  static readonly Location = "Location" as const;

  /**
   * provides a mechanism to allow and deny the use of browser features in a document or within any <iframe> elements in the document.
   *
   * refer: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy
   *
   * TODO: not understand
   *
   * @example
   * `Permission-Policy:  microphone=(), geolocation=()`
   */
  static readonly Permission_Policy = "Permission-Policy" as const;

  /**
   * defines the authentication method that should be used to gain access to a resource behind a proxy server
   *
   * refer: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Proxy-Authenticate
   *
   * TODO: not understand
   *
   * @example
   * `Proxy_Authenticate: Basic realm="Access to the internal site"`
   */
  static readonly Proxy_Authenticate = "Proxy-Authenticate" as const;

  /**
   * controls how much referrer information (sent with the Referer header) should be included with requests
   *
   * refer: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
   *
   * @example
   * `Referrer-Policy: no-referrer`
   */
  static readonly Referrer_Policy = "Referrer-Policy" as const;

  /**
   * indicates how long the user agent should wait before making a follow-up request
   *
   * refer: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After
   *
   * @example
   * `Retry-After: 1000`, 1000 means "1000 seconds"
   * `Retry-After: Wed, 21 Oct 2015 07:28:00 GMT`
   */
  static readonly Retry_After = "Retry-After" as const;

  /**
   * is used in the websocket opening handshake
   *
   * @example
   * `Sec-WebSocket-Accept: 3242afdfdezq==`
   */
  static readonly Sec_WebSocket_Accept = "Sec-WebSocket-Accept" as const;

  /**
   * describes the software used by the origin server that handled the request
   *
   * @example
   * `Server: Apache/2.4.1 (Unix)`
   */
  static readonly Server = "Server" as const;

  /**
   * TODO: not understand
   */
  static readonly Server_Timing = "Server-Timing" as const;

  /**
   * s used to send a cookie from the server to the user agent, so that the user agent can send it back to the server later.
   *
   * refer: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
   *
   * @example
   * `Set-Cookie: author=jack; Domain=www.ppt.com; Expires=Wed, 21 Oct 2015 07:28:00 GMT`
   */
  static readonly Set_Cookie = "Set-Cookie" as const;

  /**
   * links generated code to a source map, enabling the browser to reconstruct the original source and present the reconstructed original in the debugger.
   *
   * @example
   * `SourceMap: http://mm.com/2.js.map`
   */
  static readonly SourceMap = "SourceMap" as const;

  /**
   * describes the parts of the request message aside from the method and URL that influenced the content of the response it occurs in
   *
   */
  static readonly Vary = "Vary" as const;

  /**
   * refer: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/WWW-Authenticate
   */
  static readonly WWW_Authenticate = "WWW-Authenticate" as const;

  /**
   * related with MIME Type Sniffing
   * refer: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
   */
  static readonly X_Content_Type_Options = "X-Content-Type-Options" as const;

  /**
   * used to indicate whether or not a browser should be allowed to render a page in a <frame>, <iframe>, <embed> or <object>.
   *
   * related with  `click-jacking attacks`
   *
   * refer: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
   *
   * @example
   * `X-Frame-Options: DENY`
   */
  static readonly X_Frame_Options = "X-Frame-Options" as const;
}

export type ResponseHeaderType =
  | (typeof ResponseHeader)[Exclude<keyof typeof ResponseHeader, "prototype">]
  | CommonHeaderType;
