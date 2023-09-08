import { getOutputChannel, requestForText, requestHttp2ForText } from "../util";
import { constants } from "node:http2";

const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_SCHEME,
  HTTP2_HEADER_AUTHORITY
} = constants;

/**
 * 返回一个迭代器，迭代器给出查询一个单词的方案
 *
 * 当前只支持金山词霸的翻译方案
 *
 * @param word 要翻译的词
 */
function getIterator(word: string) {
  const iterator: {
    url: string;
    request: () => Promise<string>;
    decoder: (v: string) => Translation;
  }[] = [];

  // 首个版本仅使用 金山词霸 去翻译
  // TODO: 未来尝试支持调用 Apple native Dictionary App ?
  const iciRequestPlugin = (iter: typeof iterator) => {
    const url = `https://www.iciba.com/word?w=${word}`;

    const icibaRequest = () => {
      const headers = {
        [HTTP2_HEADER_METHOD]: "GET",
        [HTTP2_HEADER_PATH]: `/word?w=${word}`,
        [HTTP2_HEADER_SCHEME]: "https",
        [HTTP2_HEADER_AUTHORITY]: "www.iciba.com"
      };
      return requestHttp2ForText(url, headers);
    };

    iter.push({ url, request: icibaRequest, decoder: icibaDecoder });
  };

  [iciRequestPlugin].forEach(plugin => plugin(iterator));

  return iterator;
}

/**
 * 根据html的内容，找到翻译信息，并返回
 * @param htmlText
 */
function icibaDecoder(htmlText: string): Translation {
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
  const coreData = symbols[0];

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

/**
 * 将翻译信息整理成 markdown 可解析的内容
 * @param translation 记录关键的翻译信息
 * @param word 要翻译的词
 */
function formatAsMarkdownString(
  translation: Translation,
  word: string
): string {
  /**
   * TODO: 音频无效？怎么解决呢？
   */
  const result = `
    <h2>From vscode-plugin-dictionary</h2>
    <h3>${word}</h3>
    <section style="display: flex; gap: 6px">
      <span id="en">英 [${translation.phEn}]</span>
      <span id="am">美 [${translation.phAm}]</span>
    </section>
    <audio controls src="${translation.phEnMP3}">不支持音频</audio>
    <audio controls src="${translation.phAmMP3}">不支持音频</audio>
    <br />
    <section>
       ${translation.translations
         ?.map(item => {
           return (
             '<div style="white-space: pre-wrap">' +
             item.type +
             " " +
             item.content +
             "</div>"
           );
         })
         .join("\n")}
    </section>
    `.trim();

  return result;
}

/**
 * 根据单词，返回翻译内容，翻译内容可以在 markdown 中展示
 * @param word 要翻译的词
 */
export default async function translate(word: string): Promise<string> {
  if (word === "") {
    return "";
  }

  const iterator = getIterator(word);

  for (const { url, request, decoder } of iterator) {
    try {
      const text = await request();
      const translation = decoder(text);
      return formatAsMarkdownString(translation, word);
    } catch (error) {
      const outputChannel = getOutputChannel();
      outputChannel?.show(true);
      outputChannel?.append(
        `cannot get the result from ${url}\n` + `specific error: ${error}`
      );
    }
  }

  return "";
}

interface Translation {
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
              symbols: TranslationSymbol[];
            };
          };
        };
      };
    };
  };
}
