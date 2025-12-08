import type { ExtensiveTranslateFunction, Translation, RequestContextBuilder, RequestContext } from "@/translation-impl/hepler.type";
import { httpClient, httpsClient } from "@/translation-impl/utils/httpclient.util";
import { applyContextOnHttpClient, applyContextOnHttpsClient } from "@/translation-impl/utils/requestContext.util";
import { createDeferredPromise } from "@/translation-impl/utils/promise.util";



interface RawTranslation {
  ec: {
    word: {
        /** 美式音标 */
        usphone: string;
        /** 英式音标 */
        ukphone: string;
        trs: { pos: string; tran: string }[],
        ukspeech: string;
        usspeech: string;
    }
  }
}

/**
 * @param jsonString
 */
function decode(jsonString: string): Translation {
  const translationData = JSON.parse(jsonString) as RawTranslation;
  const { trs, ukphone, ukspeech, usphone, usspeech } = translationData.ec.word;
  return {
    translations: trs.map(item => ({
      type: item.pos,
      content: item.tran
    })),
    phAm: usphone,
    phAmMP3: `https://dict.youdao.com/dictvoice?audio=${usspeech}`,
    phEn: ukphone,
    phEnMP3: `https://dict.youdao.com/dictvoice?audio=${ukspeech}`
  };
}

const requestContextBuilder: RequestContextBuilder = (word: string) => {
  const formDataString = `q=${word}&le=en&t=2&client=web&sign=40bae1f6a677590420afa01d90691444&keyfrom=webdict`;
  return {
    url: `https://dict.youdao.com/jsonapi_s`,
    method: 'POST',
    queryParams: {
        doctype: 'json',
        jsonversion: 4
    },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    http2Headers: {},
    body: formDataString,
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

const translate: ExtensiveTranslateFunction = async (
  context,
  { httpClient, httpsClient }
) => {
  const url = new URL(context.url);
  
  switch (url.protocol) {
    case 'http:':
        return doHttpRequest(context, httpClient);
    case 'https:':
    default:
  }

  return doHttpsRequest(context, httpsClient);
}

const name = "youdao";

export { requestContextBuilder, translate, name };