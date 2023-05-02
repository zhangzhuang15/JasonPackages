import debug from "debug";
import type { ResolvedResponse } from "./index";

const debugging = debug("resolve-fetch-response-call");

export async function resolveFetchResponse(
  response: Response
): Promise<ResolvedResponse> {
  const result: ResolvedResponse = {
    status: response.status,
    statusDesc: response.statusText || "",
    headers: new Map(response.headers.entries()),
    data: {}
  };

  // TODO: when data is not in format of Blob, will response.blob be failed ?
  try {
    await response.blob();
    result.data = {
      isBlob: response.blob()
    };
    return result;
  } catch (error) {
    debugging("when response.blob() call: ", error);
  }

  try {
    await response.json();
    result.data = {
      isJson: response.json()
    };
    return result;
  } catch (error) {
    debugging("when response.json() call: ", error);
  }

  try {
    await response.text();
    result.data = {
      isText: response.text()
    };
    return result;
  } catch (error) {
    debugging("when response.text() call: ", error);
  }

  try {
    await response.arrayBuffer();
    result.data = {
      isBuffer: response.arrayBuffer()
    };
    return result;
  } catch (error) {
    debugging("when response.arrayBuffer() call: ", error);
  }

  return result;
}
