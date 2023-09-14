export interface RequestState {
  url: string;
  headers: Map<string, string>;
  data: Document | XMLHttpRequestBodyInit | null | undefined;
  method: "GET" | "POST" | "OPTIONS" | "PUT" | "HEAD";
  responseType: XMLHttpRequest["responseType"];
  /** ms */
  timeout?: number;
  credential?: boolean;
  downloadTracker?: (event: ProgressEvent) => void;
  uploadTracker?: (event: ProgressEvent) => void;
}

export interface FetchState {
  url: RequestState["url"];
  responseType: "string" | "blob" | "json" | "arraybuffer";
  method?: RequestState["method"];
  headers?: RequestState["headers"];
  body?: BodyInit | null | undefined;
  credentials?: "omit" | "include" | "same-origin";
  cache?:
    | "default"
    | "no-store"
    | "reload"
    | "no-cache"
    | "force-cache"
    | "only-if-cached"
    | "navigate"
    | "websocket";
  mode?: "cors" | "no-cors" | "same-origin";
  redirect?: "follow" | "error" | "manual";
  referrerPolicy?:
    | "no-referrer"
    | "no-referrer-when-downgrade"
    | "origin"
    | "origin-when-cross-origin"
    | "unsafe-url"
    | "same-origin"
    | "strict-origin"
    | "strict-origin-when-cross-origin";
}
