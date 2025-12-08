import { httpClient, http2Client, httpsClient, Http2Headers } from "@/translation-impl/utils/httpclient.util";;
import type { RequestContext } from "@/translation-impl/hepler.type";

export const applyContextOnHttpClient = (context: RequestContext, clientBuilder: typeof httpClient) => {
    const { url, headers, queryParams, body, method } = context;
    const urlObj = new URL(url);
    Object.entries(queryParams).forEach(([key, value]) => {
        urlObj.searchParams.append(key, String(value));
    });
    const realClient = clientBuilder(urlObj.href, { method });
    Object.entries(headers as Record<string, any>).forEach(([key, value]) => {
        realClient.setHeader(key, value);
    });
    
    if (body !== null) {
        realClient.write(body);
    }
    return realClient;
};

export const applyContextOnHttp2Client = (context: RequestContext, clientBuilder: typeof http2Client) => {
    const { url, queryParams, body, http2Headers = {} } = context;
    const urlObj = new URL(url);
    Object.entries(queryParams).forEach(([key, value]) => {
        urlObj.searchParams.append(key, String(value));
    });
    const realClient = clientBuilder(urlObj.href);
    const session = (() => {
        if (Object.keys(http2Headers).length > 0) return realClient.request(http2Headers);
        return realClient.request();
    })();

    if (body !== null) {
        session.write(body);
    }
    return session;
}

export const applyContextOnHttpsClient = (context: RequestContext, clientBuilder: typeof httpsClient) => { 
    const { url, headers, queryParams, body, method } = context;
    const urlObj = new URL(url);
    Object.entries(queryParams).forEach(([key, value]) => {
        urlObj.searchParams.append(key, String(value));
    });
    const realClient = clientBuilder(urlObj.href, { method });
    Object.entries(headers as Record<string, any>).forEach(([key, value]) => {
        realClient.setHeader(key, value);
    });
    
    if (body !== null) {
        realClient.write(body);
    }
    return realClient;
};