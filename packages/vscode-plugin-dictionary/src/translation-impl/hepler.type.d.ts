import { httpClient, httpsClient, http2Client, type Http2Headers } from "./utils/httpclient.util";

export interface Translation {
  /**
   * type, 词性; content, 词义
   */
  translations?: { type: string; content: string }[];
  /**
   * 英式英语音标
   */
  phEn?: string;
  /**
   * 美式英语音标
   */
  phAm?: string;
  /**
   * 英式英语发音mp3链接
   */
  phEnMP3?: string;
  /**
   * 美式英语发音mp3链接
   */
  phAmMP3?: string;
}

export type TranslateFunctionEntry = (word: string) => Promise<{markdownString: string}>;

export type RequestContext = {
    url: string;
    method: 'GET' | 'POST';
    queryParams: Record<string, unknown>;
    headers: Record<string, string>;
    http2Headers?: Http2Headers;
    body: unknown;
};

export type RequestContextBuilder = (word: string) => RequestContext;

export type ExtensiveTranslateFunction = (
    context: RequestContext, 
    clients: {
        httpClient: typeof httpClient;
        httpsClient: typeof httpsClient;
        http2Client: typeof http2Client;
    },
) => Promise<Translation>;