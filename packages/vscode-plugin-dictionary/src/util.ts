import type { TextEditor } from "vscode";
import { request } from "node:http";
import { request as httpsRequest } from "node:https";
import { ClientHttp2Session, connect } from "node:http2";
import { window } from "vscode";
import type { OutputChannel } from "vscode";

let outputChannel: OutputChannel | null;
const clientPool: Map<string, ClientHttp2Session> = new Map();
const MAXCLIENT = 8;

/**
 * 释放一些资源，比如客户请求池
 */
export function releaseResource() {
  clientPool.forEach(client => {
    client.close();
  });
  clientPool.clear();
}

/**
 * 注册一个崭新的Output通道
 * @param name 通道名，在Output面板中作为通道标识，便于查找
 */
export function registerOutputChannel(name: string) {
  if (outputChannel) {
    return;
  }
  outputChannel = window.createOutputChannel(name);
}

/**
 * 获取本插件使用的Output通道
 */
export function getOutputChannel() {
  return outputChannel;
}

/**
 * 删除引用，释放内存
 */
export function releaseOutputChannel() {
  outputChannel = null;
}

/**
 * 获取当前选中的文字
 * @param activeTextEditor 被选中文字所在的编辑框
 */
export function getCurrentSelectionText(activeTextEditor?: TextEditor) {
  if (!activeTextEditor) {
    return "";
  }

  const selection = activeTextEditor.selection;
  const word = activeTextEditor.document.getText(selection);
  return word;
}

/**
 * 获取文字选中区域的起点和终点
 * @param activeTextEditor 文字选中区所在的编辑框
 * @example
 * ```ts
 * import { window } from "vscode"
 *
 * const position = getCurrentSelectionPosition(window.activeTextEditor)
 *
 * if (position === null) {
 *    console.log("no active text editor");
 * } else {
 *   const { start, end } = position;
 *
 *   // you can use start or end to do some
 *   // tasks related with position comparing
 * }
 * ```
 */
export function getCurrentSelectionPosition(activeTextEditor?: TextEditor) {
  if (!activeTextEditor) {
    return null;
  }

  const selection = activeTextEditor.selection;

  return {
    start: selection.start,
    end: selection.end
  };
}

export function createDeferredPromise<T = string>() {
  let resolve: ((value: T | PromiseLike<T>) => void) | null = null;
  let reject: ((reason?: any) => void) | null = null;

  const promise = new Promise<T>((r, rj) => {
    resolve = r;
    reject = rj;
  });

  return {
    resolve: resolve!,
    reject: reject!,
    promise
  };
}

/**
 * 发送 http/https 请求，获取文本内容，返回值是被请求的文本，比如一个html的内容
 * @param url 请求地址，http或者https的地址
 * @param options
 */
export function requestForText(
  url: string,
  options: { method: "GET" | "POST" }
): Promise<string> {
  const { resolve, reject, promise } = createDeferredPromise();

  const req = new URL(url).protocol === "http" ? request : httpsRequest;

  req(url, options, res => {
    let text = "";
    res.on("data", chunk => {
      text += String(chunk);
    });
    res.on("end", () => {
      resolve(text);
    });
    res.on("error", err => {
      reject(err);
    });
  });

  return promise;
}

/**
 * 发送http2请求，获取文本内容，返回值是被请求的文本，比如一个html的内容
 * @param url 请求的地址，一定是https的地址
 * @param http2Headers http2的请求头
 */
export function requestHttp2ForText(
  url: string,
  http2Headers: Record<string, string>
): Promise<string> {
  const urlObj = new URL(url);
  const origin = urlObj.origin;

  let client: ClientHttp2Session;

  if (clientPool.has(origin)) {
    client = clientPool.get(origin)!;
  } else {
    // url 中的 path query hash 会被 connect 忽略
    client = connect(url);
    if (clientPool.size >= MAXCLIENT) {
      // 删除最早进入pool的client
      const firstKey = clientPool.keys().next().value;
      const oldestClient = clientPool.get(firstKey);
      oldestClient?.close();
      clientPool.delete(firstKey);

      clientPool.set(origin, client);
    }
  }

  let result = "";
  const { resolve, reject, promise } = createDeferredPromise();

  const stream = client.request(http2Headers);

  stream.on("data", chunk => {
    result += chunk;
  });

  stream.on("end", () => {
    resolve(result);
    stream.close();
  });

  stream.on("error", err => {
    reject(err);
    stream.close();
  });

  return promise;
}

let timeOutId: any;
let curPromiseResolver: any;

// 用这种方式来限制短时间内发送多个翻译请求
export const debounceBlocker = (milliseconds: number) => {
  const { promise, resolve } = createDeferredPromise<boolean>();

  if (curPromiseResolver) {
    curPromiseResolver(true);
  }

  if (timeOutId) {
    clearTimeout(timeOutId);
  }

  timeOutId = setTimeout(() => {
    clearTimeout(timeOutId);
    timeOutId = null;
    resolve(false);
    curPromiseResolver = null;
  }, milliseconds);

  curPromiseResolver = resolve;

  return promise;
};
