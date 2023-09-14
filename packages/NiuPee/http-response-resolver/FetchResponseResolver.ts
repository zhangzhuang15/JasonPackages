import debug from "debug";
import type { ResolvedResponse } from "./index";
import { FetchState } from "../http-request-engine/state";

const fetchDebugging = debug("BrowserRequestFetchFireState");

/**
 * resolve the response returned by fetch api;
 * the response might cause error when we transform it to the expected-format data,
 * so we cannot assume there is no error like resolveXHRResponse;
 * @param response
 * @param responseType
 */
export async function resolveFetchResponse(
  response: Response,
  responseType: FetchState["responseType"]
): Promise<ResolvedResponse> {
  const headers: [string, string][] = [];
  response.headers.forEach((value, key) => {
    headers.push([key, value]);
  });

  const result: ResolvedResponse = {
    status: response.status,
    statusDesc: response.statusText || "",
    headers: new Map(headers),
    data: {}
  };

  if (responseType === "blob") {
    // TODO: when data is not in format of Blob, will response.blob be failed ?
    try {
      // we can only invoke response.blob for one time!
      result.data = await response.blob();
      return result;
    } catch (error) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({
        type: "fetch-read-blob-error",
        event: {
          ...result,
          error
        }
      });
    }
  } else if (responseType === "json") {
    try {
      result.data = await response.json();
      return result;
    } catch (error) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({
        type: "fetch-read-json-error",
        event: {
          ...result,
          error
        }
      });
    }
  } else if (responseType === "string") {
    try {
      result.data = await response.text();
      return result;
    } catch (error) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({
        type: "fetch-read-text-error",
        event: {
          ...result,
          error
        }
      });
    }
  }

  try {
    result.data = await response.arrayBuffer();
    return result;
  } catch (error) {
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({
      type: "fetch-read-arraybuffer-error",
      event: {
        ...result,
        error
      }
    });
  }
}

export function resolveFetchError(error: unknown) {
  const { type, event } = error as {
    type:
      | "fetch-network-error"
      | "fetch-http-error"
      | "fetch-read-json-error"
      | "fetch-read-blob-error"
      | "fetch-read-text-error"
      | "fetch-read-arraybuffer-error";
    event: unknown;
  };

  switch (type) {
    case "fetch-network-error":
      fetchDebugging("network error: ", event);
      break;
    case "fetch-http-error":
      fetchDebugging("http error: ", event);
      break;
    case "fetch-read-json-error":
      fetchDebugging(
        "error when transform fetched Response to json format: ",
        event
      );
      break;
    case "fetch-read-blob-error":
      fetchDebugging(
        "error when transform fetched Response to blob format: ",
        event
      );
      break;
    case "fetch-read-text-error":
      fetchDebugging(
        "error when transform fetched Response to text format: ",
        event
      );
      break;
    case "fetch-read-arraybuffer-error":
      fetchDebugging(
        "error when transform fetched Response to array buffer format: ",
        event
      );
      break;
    default:
      fetchDebugging("unknown error type: ", error);
  }
}
