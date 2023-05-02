/**
 * common header is the header that exists in both request and response.
 */
export class CommonHeader {
  /**
   * control caching in browsers and shared caches
   *
   * refer: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
   *
   * @example
   * `Cache-Control: no-cache`
   * `Cache-Control: max-age=500`, 500 means "500 seconds"
   * `Cache-Control: no-store`
   * `Cache-Control: private`
   */
  static readonly Cache_Control = "Cache-Control" as const;

  /**
   * controls whether the network connection stays open after the current transaction finishes
   *
   * prohibited in HTTP/2 and HTTP/3.
   *
   * refer: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Connection
   *
   * @example
   * `Connection: keep-alive`
   * `Connection: close`
   */
  static readonly Connection = "Connection" as const;

  /**
   * indicate if the content is expected to be displayed inline in the browser, that is, as a Web page or as part of a Web page, or as an attachment, that is downloaded and saved locally
   *
   * refer: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition
   *
   * @example
   * `Content-Disposition: inline`
   * `Content-Disposition: attachment`
   * `Content-Disposition: attachment; filename="filename.jpg"`
   * `Content-Disposition: form-data; name="fieldName"; filename="filename.jpg"`
   */
  static readonly Content_Disposition = "Content-Disposition" as const;

  /**
   * maybe used in client request or server response, server response is more frequent.
   * tell the opposite how the body content encoded, and the opposite could decode then.
   *
   * refer: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding
   *
   * @example
   * `Content-Encoding: gzip`
   * `Content-Encoding: br`
   * `Content-Encoding: deflate`
   */
  static readonly Content_Encoding = "Content-Encoding" as const;

  /**
   * maybe used in client request or server response, server response is more frequent.
   * tell the opposite how the body content is intended to be provided to people who speak
   * the specific language.But the body content might not be written in that language.
   *
   * @example
   * `Content-Language: en-US`
   */
  static readonly Content_Language = "Content-Language" as const;

  /**
   * maybe used in client request or server response, server response is more frequent.
   * indicates the size of the message body, in bytes, sent to the recipient.
   *
   * @example
   * `Content-Length: 3000`, 3000 means "3000 bytes"
   */
  static readonly Content_Length = "Content-Length" as const;

  /**
   * maybe used in client request or server response, server response is more frequent.
   * indicates an alternate location for the returned data.
   *
   * refer: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Location
   *
   * @example
   * `Content-Location: /images/hello.png`
   */
  static readonly Content_Location = "Content-Location" as const;

  /**
   * maybe used in client request or server response, server response is more frequent.
   * is used to indicate the original media type of the resource.
   * In responses, a Content-Type header provides the client with the actual content type of the returned content.
   * In requests, (such as POST or PUT), the client tells the server what type of data is actually sent.
   *
   * refer: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type
   *
   * @example
   * `Content-Type: text/html; charset=utf-8`
   * `Content-Type: multipart/form-data; boundary=something`
   */
  static readonly Content_Type = "Content-Type" as const;

  /**
   * contains the date and time at which the message originated
   *
   * refer: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Date
   *
   * @example
   * `Date: Wed, 21 Oct 2015 07:28:00 GMT`
   */
  static readonly Date = "Date" as const;

  /**
   * allows the sender to hint about how the connection may be used to set a timeout and a maximum amount of requests.
   *
   * TODO: not understand
   */
  static readonly Keep_Alive = "Keep-Alive" as const;

  /**
   * maybe used by client request or server response, server response is more frequent.
   * contains a date and time when the origin server believes the resource was last modified. It is used as a validator to determine if the resource is the same as the previously stored one.
   *
   * refer: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Last-Modified
   *
   * @example
   * `Last-Modified: Wed, 21 Oct 2015 07:28:00 GMT`
   */
  static readonly Last_Modified = "Last-Modified" as const;

  /**
   * allows the sender to include additional fields at the end of chunked messages in order to supply metadata that might be dynamically generated while the message body is sent, such as a message integrity check, digital signature, or post-processing status.
   *
   * refer: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Trailer
   *
   */
  static readonly Trailer = "Trailer" as const;

  /**
   * specifies the form of encoding used to safely transfer the payload body to the user.
   *
   * @example
   * `Transfer-Encoding: gzip, chunked`
   */
  static readonly Transfer_Encoding = "Transfer-Encoding" as const;

  /**
   * The HTTP 1.1 (only) Upgrade header can be used to upgrade an already established client/server connection to a different protocol (over the same transport protocol).
   *
   * @example
   * `Upgrade: websocket`
   */
  static readonly Upgrade = "Upgrade" as const;

  /**
   * is added by proxies, both forward and reverse, and can appear in the request or response headers.
   */
  static readonly Via = "Via" as const;

  /**
   * ask the server to provide a digest of the requested resource using the Digest response header.
   */
  static readonly Want_Digest = "Want-Digest" as const;
}

export type CommonHeaderType = (typeof CommonHeader)[Exclude<
  keyof typeof CommonHeader,
  "prototype"
>];
