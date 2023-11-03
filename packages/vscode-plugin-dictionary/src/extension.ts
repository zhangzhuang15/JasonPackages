// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { Hover, MarkdownString, window, languages, commands } from "vscode";
import {
  translate as translateToChinese,
  FAILEDTIPS
} from "./translation-impl/translate-to-chinese";
import {
  debounceBlocker,
  getCurrentSelectionPosition,
  getCurrentSelectionText,
  registerOutputChannel,
  releaseOutputChannel,
  releaseResource
} from "./util";

let allowTranslateEnglish = false;

// 插件已经安装、激活，立即执行本方法
export function activate(context: vscode.ExtensionContext) {
  const pluginName = context.extension.packageJSON.name;

  // 创建一个通道，可以将信息打印在 vscode OUTPUT 面板里，方便日志追踪
  registerOutputChannel(pluginName);

  // 注册hover, 当选中一个单词后，就可以在单词上边创建一个小方框，放入翻译信息
  languages.registerHoverProvider(
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
        let markdownString = await translateToChinese(text);

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

  // 注册命令
  context.subscriptions.push(
    commands.registerCommand(`${pluginName}.toggleTranslateEnglish`, () => {
      allowTranslateEnglish = !allowTranslateEnglish;
      if (allowTranslateEnglish === false) {
        releaseResource();
      }
    })
  );
}

export function deactivate() {
  releaseOutputChannel();
}
