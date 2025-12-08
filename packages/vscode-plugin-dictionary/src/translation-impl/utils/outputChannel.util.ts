import type { OutputChannel } from "vscode";
import { window } from "vscode";

let outputChannel: OutputChannel | null;
/**
 * 注册一个崭新的Output通道
 * @param name 通道名，在Output面板中作为通道标识，便于查找
 */
export function registerOutputChannel(name: string) {
  if (outputChannel) {
    return outputChannel;
  }
  outputChannel = window.createOutputChannel(name);
  return outputChannel;
}

/**
 * 获取本插件使用的Output通道
 */
export function getOutputChannel() {
  return outputChannel;
}

/**
 * 删除引用，释放内存
 */
export function releaseOutputChannel() {
  outputChannel = null;
}
