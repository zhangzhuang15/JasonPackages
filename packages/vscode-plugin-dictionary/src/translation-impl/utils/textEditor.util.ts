import type { TextEditor } from "vscode";

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