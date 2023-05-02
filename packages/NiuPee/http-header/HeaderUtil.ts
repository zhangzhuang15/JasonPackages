import type { ResponseHeaderType } from "./ResponseHeader";
import { RequestHeader, RequestHeaderType } from "./RequestHeader";
import { ResponseHeader } from "./ResponseHeader";

/**
 * HeaderUtil offers some useful functions to helping you dealing with some problems.
 *
 * e.g. if you wonder whether a response header related with CORS, you can call
 * `HeaderUtil.isCorsResponseHeader(header)`
 */
export class HeaderUtil {
  /**
   * return an iter about [cors-safelisted-request-header](https://developer.mozilla.org/en-US/docs/Glossary/CORS-safelisted_request_header),
   *
   * if you request only with cors-safelisted-request-header, the browser won't
   * send preflight request in the context of CORS.
   */
  static corsSafelistedRequestHeaderIter(): string[] {
    return [
      RequestHeader.Accept,
      RequestHeader.Accept_Language,
      RequestHeader.Content_Language,
      RequestHeader.Content_Type
    ];
  }

  /**
   * return an iter about response header in the context of CORS.
   */
  static corsResponseHeaderIter(): string[] {
    return [
      ResponseHeader.Access_Control_Allow_Credentials,
      ResponseHeader.Access_Control_Allow_Headers,
      ResponseHeader.Access_Control_Allow_Methods,
      ResponseHeader.Access_Control_Allow_Origin,
      ResponseHeader.Access_Control_Expose_Headers,
      ResponseHeader.Access_Control_Max_Age
    ];
  }

  /**
   * return an iter about forbidden-request-header
   *
   * forbidden request header is header that you cannot modified in the context of browser.
   * only browser itself can modify these headers.
   *
   * e.g. you cannot change the `Cookie` header with `XMLHttpRequest` API, but you can
   * change `cookie` itself using `document.cookie`
   *
   */
  static forbiddenRequestHeaderIter(): string[] {
    return [
      RequestHeader.Accept_Encoding,
      RequestHeader.Access_Control_Request_Headers,
      RequestHeader.Access_Control_Request_Method,
      RequestHeader.Connection,
      RequestHeader.Content_Length,
      RequestHeader.Cookie,
      RequestHeader.Date,
      RequestHeader.Expect,
      RequestHeader.Host,
      RequestHeader.Keep_Alive,
      RequestHeader.Origin,
      RequestHeader.Referer,
      RequestHeader.TE,
      RequestHeader.Trailer,
      RequestHeader.Transfer_Encoding,
      RequestHeader.Upgrade,
      RequestHeader.Via,
      RequestHeader.Proxy_Authorization,
      RequestHeader.Sec_Fetch_Dest,
      RequestHeader.Sec_Fetch_Mode,
      RequestHeader.Sec_Fetch_Site,
      RequestHeader.Sec_Fetch_User
    ];
  }

  /**
   * return an iter about forbidden-response-header
   *
   * forbidden response header is `Set-Cookie` so far.
   */
  static forbiddenResponseHeaderIter(): string[] {
    return [ResponseHeader.Set_Cookie];
  }

  /**
   * return an iter about forbidden-request-header or forbidden-response-header.
   *
   * forbidden request header is header that you cannot modified in the context of browser.
   * only browser itself can modify these headers.
   *
   * e.g. you cannot change the `Cookie` header with `XMLHttpRequest` API, but you can
   * change `cookie` itself using `document.cookie`
   *
   * forbidden response header is `Set-Cookie` so far.
   */
  static forbiddenHeaderIter(): string[] {
    return HeaderUtil.forbiddenRequestHeaderIter().concat(
      HeaderUtil.forbiddenResponseHeaderIter()
    );
  }

  /**
   * see response-header if is related with CORS
   */
  static isCorsResponseHeader(header: ResponseHeaderType) {
    return HeaderUtil.corsResponseHeaderIter().includes(header);
  }
}
