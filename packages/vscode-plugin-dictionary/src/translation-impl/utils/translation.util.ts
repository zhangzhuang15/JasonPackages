import { Translation } from "@/translation-impl/hepler.type";
/**
 * 将翻译信息整理成 markdown 可解析的内容
 * @param translation 记录关键的翻译信息
 * @param word 要翻译的词
 */
export function formatAsMarkdownString(
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
    <br />
    `.trim();

  return result;
}