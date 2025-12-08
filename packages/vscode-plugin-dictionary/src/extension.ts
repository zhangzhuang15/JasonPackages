// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { Hover, MarkdownString, window, languages, commands } from "vscode";
import translatorDictionary from "@/translation-impl/translator/index";
import { http2Client, httpClient, httpsClient } from "@/translation-impl/utils/httpclient.util";
import { formatAsMarkdownString } from "@/translation-impl/utils/translation.util";
import { registerOutputChannel, releaseOutputChannel, getOutputChannel } from "@/translation-impl/utils/outputChannel.util";
import { debounceBlocker } from "@/translation-impl/utils/promise.util";
import { getCurrentSelectionPosition, getCurrentSelectionText,} from "@/translation-impl/utils/textEditor.util"

let allowTranslateEnglish = false;
let currenTranslator: 'iciba' | 'youdao' = 'iciba';

// 单词拼写可能有错，给出如下提示
const FAILEDTIPS = `
<h2>From vscode-plugin-dictionary</h2>
<p>Is this word valid ?</p>
<br />`;

function registerHoverProvider() {
  // 注册hover, 当选中一个单词后，就可以在单词上边创建一个小方框，放入翻译信息
  return languages.registerHoverProvider(
    { scheme: "file" },
    {
      provideHover: async (document, position, token) => {
        // 插件功能没有激活，或者调整为关闭状态，不给出翻译提示
        if (allowTranslateEnglish === false) {
          return null;
        }

        const blockBelow = await debounceBlocker(500);

        if (blockBelow) {
          return null;
        }

        // 光标位置不在选中的文字内，不给出翻译提示
        const currentSelectionPosition = getCurrentSelectionPosition(
          window.activeTextEditor
        );
        if (currentSelectionPosition === null) {
          return null;
        }
        const { start, end } = currentSelectionPosition;
        if (position.isBefore(start) || position.isAfter(end)) {
          return null;
        }

        const text = getCurrentSelectionText(window.activeTextEditor);
        const { requestContextBuilder, translate } = translatorDictionary[currenTranslator];
        let markdownString = formatAsMarkdownString(
          await translate( requestContextBuilder(text), { http2Client, httpClient, httpsClient}),
          text
        );

        if (markdownString === "") {
          markdownString = FAILEDTIPS;
        }

        const markdownContents = new MarkdownString(markdownString);
        // 只支持图文上的html渲染，视频和音频不支持
        markdownContents.supportHtml = true;
        return new Hover(markdownContents);
      }
    }
  );
}

// 插件已经安装、激活，立即执行本方法
export function activate(context: vscode.ExtensionContext) {
  const pluginName = context.extension.packageJSON.name;

  // 创建一个通道，可以将信息打印在 vscode OUTPUT 面板里，方便日志追踪
  context.subscriptions.push(
    registerOutputChannel(pluginName)
  );

  context.subscriptions.push(
    registerHoverProvider()
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      const translatorConfigKey = ["vscodePluginDictionary", "translator"];
      const changed = e.affectsConfiguration(translatorConfigKey.join('.'));
      if (changed) {
        const oldTranslator = currenTranslator;
        currenTranslator = vscode.workspace.getConfiguration(translatorConfigKey[0]).get(translatorConfigKey[1], 'iciba');
        getOutputChannel()?.appendLine(`translator changed from ${oldTranslator} to ${currenTranslator}`);
      }
    })
  );

  // 注册命令
  context.subscriptions.push(
    commands.registerCommand(`${pluginName}.toggleTranslateEnglish`, () => {
      allowTranslateEnglish = !allowTranslateEnglish;
    })
  );

}

export function deactivate() {
  releaseOutputChannel();
}
