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
