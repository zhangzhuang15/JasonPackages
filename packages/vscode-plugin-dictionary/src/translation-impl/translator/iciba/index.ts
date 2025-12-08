import type { ExtensiveTranslateFunction, Translation, RequestContextBuilder, RequestContext } from "@/translation-impl/hepler.type";
import { httpClient, httpsClient, http2Client } from "@/translation-impl/utils/httpclient.util";
import { applyContextOnHttp2Client, applyContextOnHttpClient, applyContextOnHttpsClient } from "@/translation-impl/utils/requestContext.util";
import { createDeferredPromise } from "@/translation-impl/utils/promise.util";
import { constants } from "node:http2";

const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_SCHEME,
  HTTP2_HEADER_AUTHORITY
} = constants;

interface TranslationSymbol {
  /**
   * 英式英语音标
   */
  ph_en: string;
  /**
   * 美式英语音标
   */
  ph_am: string;
  /**
   * 英式英语发音mp3链接
   */
  ph_en_mp3: string;
  /**
   * 美式英语发音mp3链接
   */
  ph_am_mp3: string;
  /**
   * part, 词性; means, 词义
   */
  parts: { part: string; means: string[] }[];
}

interface RawTranslation {
  props: {
    pageProps: {
      initialReduxState: {
        word: {
          wordInfo: {
            baesInfo: {
              symbols?: TranslationSymbol[];
            };
          };
        };
      };
    };
  };
}

/**
 * 根据html的内容，找到翻译信息，并返回
 * @param htmlText
 */
function decode(htmlText: string): Translation {
  /**
   * 有关翻译的信息，全部位于 <script id="__NEXT_DATA__"></script>标签内，
   * 里面包裹的是一个json数据，我们用正则表达式直接提取出来
   */
  const reg = /<script id="__NEXT_DATA__" .*?json">(.*?)<\/script>/;
  const matched = reg.exec(htmlText);
  if (matched === null) {
    return {};
  }

  const jsonString = matched[1];
  const translationData = JSON.parse(jsonString) as RawTranslation;
  const { symbols } =
    translationData.props.pageProps.initialReduxState.word.wordInfo.baesInfo;
  const coreData = symbols?.[0];

  if (coreData === undefined) {
    throw new Error("the word may be invalid");
  }

  return {
    translations: coreData.parts.map(item => ({
      type: item.part,
      content: item.means.join(";")
    })),
    phAm: coreData.ph_am,
    phAmMP3: coreData.ph_am_mp3,
    phEn: coreData.ph_en,
    phEnMP3: coreData.ph_en_mp3
  };
}

const requestContextBuilder: RequestContextBuilder = (word: string) => {
  return {
    url: `https://www.iciba.com/word`,
    method: 'GET',
    queryParams: {
        w: word,
    },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    },
    http2Headers: {
        [HTTP2_HEADER_METHOD]: "GET",
        [HTTP2_HEADER_PATH]: `/word?w=${word}`,
        [HTTP2_HEADER_SCHEME]: "https",
        [HTTP2_HEADER_AUTHORITY]: "www.iciba.com"
    },
    body: null,
  };
};

const doHttpRequest = (context: RequestContext, clientBuilder: typeof httpClient): Promise<Translation> => {
    const realClient = applyContextOnHttpClient(context, clientBuilder);
    const {resolve, reject, promise } = createDeferredPromise<Translation>();
    let result = '';

    realClient.on("response", (res) => {
      res.on("data", chunk => {
        result += chunk;
      });

      res.on("end", () => {
          resolve(decode(result));
          realClient.destroy();
      });

      res.on("error", err => {
        reject(err);
        realClient.destroy();
      })
    });

    realClient.on("error", err => {
        reject(err);
        realClient.destroy();
    });

    realClient.end();

    return promise;
};

const doHttpsRequest = (context: RequestContext, clientBuilder: typeof httpsClient): Promise<Translation> => {
    const realClient = applyContextOnHttpsClient(context, clientBuilder);
    const {resolve, reject, promise} = createDeferredPromise<Translation>();
    let result = '';

    realClient.on("response", (res) => {
      res.on("data", chunk => {
        result += chunk;
      });

      res.on("end", () => {
        const r = decode(result)
        resolve(r);
        realClient.destroy();
      });

      res.on("error" , err => {
        reject(err);
        realClient.destroy();
      });
    });
    
    realClient.on("error", err => {
        reject(err);
        realClient.destroy();
    });

    realClient.end();

    return promise;
}

const doHttp2Request = (context: RequestContext, clientBuilder: typeof http2Client): Promise<Translation> => {
    const realClient = applyContextOnHttp2Client(context, clientBuilder);
    realClient.end();
    
    const {resolve, reject, promise} = createDeferredPromise<Translation>();
    let result = '';
    realClient.on("data", chunk => {
        result += chunk;
    });

    realClient.on("end", () => {
        resolve(decode(result));
        realClient.close();
    });

    realClient.on("error", err => {
        reject(err);
        realClient.close();
    });

    return promise;
}

const translate: ExtensiveTranslateFunction = async (
  context,
  { httpClient, httpsClient, http2Client }
) => {
  const url = new URL(context.url);
  
  switch (url.protocol) {
    case 'http:':
        return doHttpRequest(context, httpClient);
    case 'https:':
    default:
  }

  try {
    return doHttpsRequest(context, httpsClient);
  } catch (_) {
    return doHttp2Request(context, http2Client);
  }
}

const name = "iciba";

export { requestContextBuilder, translate, name };