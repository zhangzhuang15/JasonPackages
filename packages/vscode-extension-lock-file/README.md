# lock-file-vscode-plugin
Allow you to set which files cannot be modified, renamed and deleted. Let's say you use some extensions like chatgpt, they might delete/rename/modify files you don't want to change, this extension helps you out. 

## Features
- Make specific files cannot be modified when save it
- Make file name cannot be renamed with vscode UI interaction
- Make file cannot be removed with vscode UI interaction

## Requirements
No.

## Usage
1. install this extension
2. create .vscode/settings.json in your project:
```json
{
	"lockfileVscodePlugin.lockedFiles": ["test\\.txt"]
}
```
3. done 

When you remove/modify/rename a file and its filesystem path matches regexp you have set (in this example, "test\\.txt"), this file will be protected, you're failed to remove/modify/rename it.

## Extension Settings
This extension contributes the following settings:
* `lockfileVscodePlugin.lockedFiles`: a regexp string array, pointing at which files should be protected.

## Known Issues
It doesn't work with directory, in other words, if you remove/rename directory, no protection. This is caused by vscode internal design, it doesn't report any delete event when remove directory.

## Release Notes

### 0.0.1

Initial release
