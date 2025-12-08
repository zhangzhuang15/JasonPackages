# vscode-plugin-dictionary

For Chinese, sometimes you read files in vscode, such as Markdown file, and find a English word you don't know,
you might copy the word to browser or other apps, get the translation. It's not convenient. Now, you can install
this plugin to get the translation without leaving vscode.

对于中国用户来说，有时在 vscode 上阅读一些文件，比如 markdown 文件，会发现一个英文单词不认识，你可能会把单词复制到浏览器或者别的 App 中
查找，拿到单词的翻译。这样做很不方便。现在，你可以安装这个插件，不用离开 vscode 界面就可以查看翻译了。

## Features

- translation in hover tip without leaving vscode
  > 翻译位于提示框中，你无须离开 vscode 界面
- contains English word, Chinese meaning, phonetic sign
  > 包括英文单词，中文翻译，音标

## Requirements

No requirements, except for healthy network.

## Extension Settings

No settings.

## Known Issues

Welcome to put your issues.
[where to put your issue](https://github.com/zhangzhuang15/JasonPackages/issues)

## Release Notes

### 0.0.1

Initial release

### 1.0.0

1. [fix bug](https://github.com/zhangzhuang15/JasonPackages/issues/6)
2. refactor code, make it more extensive
3. add settings configuration for future extending

### 1.1.0

support youdao dictionary

---

## Get Started

Firstly, install this plugin from extension market.
(首先，从插件市场安装这个插件)

Second, open a file in your vscode, such as a markdown file.
(其次，用 vscode 打开一个文件，比如一个 markdown 文件)

Then, take a right-click, and choose `Toggle to Translate English`.
(接着，在文件编辑区域，右键，选中 `Toggle to Translate English`)

Now, let's try to translate English word!
(现在，让我们尝试翻译英文单词吧)

Keep in mind that you connect to internet.
(切记，你要联上网)

Select a word with your mouse, this word will be in hightlight background.Then hover your mouse on this word, and you will see a tip hover the word, containing the translation.
(用鼠标选中一个单词，这个单词的背景色会变成高亮颜色，之后将你的鼠标悬在单词上，你就能看到会浮现一个小提示框，里面就是你要的翻译信息)

The tip seems to be like this:
(框内的翻译信息长得大概是这样)

```
From vscode-plugin-dictionary
banana

英 [bəˈnɑːnə] 美 [bəˈnænə]
n. 香蕉
adj.发狂的
```

Great!

If you want to stop translating, you can take a right-click in your editor, choose `Toggle to Translate English` again.
(如果你像关闭翻译功能，你可以再次右键，选中`Toggle to Translate English`)

As default, it uses iciba to translate word, but you can switch to another tool.(默认情况，这个插件底层使用“金山词典”翻译单词，但是你可以切换到别的查询工具)

1. Open your vscode Settings(on macOS Command+,) (打开 vscode 的`Settings`面板, macOS 使用 `Command+,`的快捷键)
2. Input "vscode-plugin-dictionary.translator" (输入 `vscode-plugin-dictionary.translator`)
3. Select another tool, e.g. youdao (从下拉框中选择别的工具，比如 youdao)
4. Done! Now, we're searching word based on that selected tool.(可以了，现在我们查询单词翻译的时候，底层就是用了你选中的那个工具)

If you meet some problems, you can open your `Output`
panel which is next to `DEBUG CONSOLE` panel, choose `vscode-plugin-dictionary`, it logs some valuable messages about the problems.
(如果你遇到一些问题，你可以打开`Output`面板，它就挨着`DEBUG CONSOLE`面板，然后在列表中选中 `vscode-plugin-dictionary`, 此时面板中就会展示一些定位问题的有用信息)

Finally, you can contain these messages in your issue.
(最后，在你提交的 issue 中带上这些信息)
