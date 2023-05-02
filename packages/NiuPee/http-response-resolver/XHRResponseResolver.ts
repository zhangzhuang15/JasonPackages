import debug from "debug";
import type { ResolvedResponse } from "./index";
/**
 * deal with the XHR response here, and return a resolved value;
 * remember that we assume the http response comes back successfully;
 * */
export function resolveXHRResponse(request: XMLHttpRequest): ResolvedResponse {
  const headers: [string, string][] = request
    .getAllResponseHeaders()
    .trim()
    .split(/[\r\n]+/)
    .map(line => {
      const [header, ...val] = line.split(":");
      const value = val.join(":").trim();
      return [header, value];
    });

  const result: ResolvedResponse = {
    status: request.status,
    statusDesc: request.statusText || "",
    headers: new Map(headers),
    data: {}
  };

  switch (request.responseType) {
    case "arraybuffer":
      result.data = {
        isBuffer: Promise.resolve(request.response)
      };
      break;
    case "blob":
      result.data = {
        isBlob: Promise.resolve(request.response)
      };
      break;
    case "json":
      result.data = {
        isJson: Promise.resolve(request.response)
      };
      break;
    // TODO: I don't make sure if "document" could be treated as same as "text"
    case "document":
    case "text":
    default:
      result.data = {
        isText: Promise.resolve(request.response)
      };
  }

  return result;
}

const xhrDebugging = debug("BrowserRequestXHRFireState");

export function resolveXHRError(error: unknown) {
  const { type, event } = error as {
    type: "not-send" | "onerror" | "ontimeout";
    event: unknown;
  };

  switch (type) {
    // the request not send out
    case "not-send":
      xhrDebugging("request header might be invalid: ", event);
      break;
    // the request is failed because of network or something else
    case "onerror":
      xhrDebugging("xhr request api error, might be network error: ", event);
      break;
    // the request is failed just because of timeout
    case "ontimeout":
      xhrDebugging("xhr request timeout error: ", event);
      break;
    default:
      xhrDebugging("unexpected error out of caught: ", event);
  }

  return error;
}
