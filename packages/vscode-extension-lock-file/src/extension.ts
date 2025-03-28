import * as vscode from 'vscode';
import { outputFile } from "fs-extra";

const fileManager = new Map<string, string>();
function memorizeFile(filename: vscode.Uri) {
	return new Promise((r) => {
		if (fileManager.has(filename.fsPath)) {r('');}
		vscode.workspace.fs.readFile(filename)
		  .then(bytes => {
			const text = bytes.toString();
			fileManager.set(filename.fsPath, text);
			r('');
		  });
	});
}
function recoverFile(filename: vscode.Uri) {
	return new Promise((r) => {
		if (!fileManager.has(filename.fsPath)) { r('');}
		const text = fileManager.get(filename.fsPath)!;
		outputFile(filename.fsPath, text).then(() => r(''));
	}); 
}

let currentConfig = { value: [] as string[] };
function loadConfig() {
	const config = vscode.workspace.getConfiguration("lockfileVscodePlugin").get("lockedFiles") as string[];
	currentConfig.value = config;
}
function readConfig() {
	if (currentConfig.value.length === 0) {loadConfig();}
	return currentConfig.value;
}

function isLockedFile(file: string) {
	const matchMode = readConfig();
	if (!matchMode) {return false;}
	return matchMode.some(mode => {
		const reg = new RegExp(mode);
		return reg.test(file);
	});
}

export function activate(context: vscode.ExtensionContext) {
	console.log('extension "lock-file-vscode-plugin" is active now');

	const output = vscode.window.createOutputChannel("lock-file");
	output.appendLine('lock-file channel starts working');
	context.subscriptions.push(output);

	{
		// suspend config change
		const disposable = vscode.workspace.onDidChangeConfiguration(event => {
			const configChanged = event.affectsConfiguration("lockfileVscodePlugin.lockedFiles");
			if (configChanged) {
				output.appendLine("configuration is changed, reload config.");
				loadConfig();
			}
		});
	
		context.subscriptions.push(disposable);
	}
	
	{
		// not allow to modify files
		const disposableOne = vscode.workspace.onWillSaveTextDocument(event => {
			const filename = event.document.fileName;
			if (isLockedFile(filename)) {
				output.appendLine(`file: ${filename}, will be saved, we dont allow`);
				event.waitUntil(memorizeFile(event.document.uri));
			}
		});
		const disposableTwo = vscode.workspace.onDidSaveTextDocument(event => {
			const filename = event.fileName;
			if (isLockedFile(filename)) {
				output.appendLine(`file: ${filename}, will be recovered`);
				recoverFile(event.uri);
			}
		});
		context.subscriptions.push(disposableOne);
		context.subscriptions.push(disposableTwo);
	}

	{
		// not allow to delete files	
		const disposableOne = vscode.workspace.onWillDeleteFiles(async (event) => {
			const filenames = event.files;
			const cannotDelete = filenames.some((filename) => isLockedFile(filename.fsPath));
			if (cannotDelete) {
				filenames.forEach((filename) => {
					output.appendLine(`cannot delete file ${filename.fsPath}`);
					memorizeFile(filename);
				});
			}
		});
		const disposableTwo = vscode.workspace.onDidDeleteFiles(async (event) => {
			event.files.forEach(file => {
				if (isLockedFile(file.fsPath))
				{recoverFile(file);}
			});
		});
		context.subscriptions.push(disposableOne);
		context.subscriptions.push(disposableTwo);
	}

	{
		// not allow to rename files
		const disposable = vscode.workspace.onDidRenameFiles(event => {
			const filenames = event.files;
			filenames.forEach(filename => {
				if (isLockedFile(filename.oldUri.fsPath)) {
					output.appendLine(`cannot rename file ${filename.oldUri.fsPath}`);
					vscode.workspace.fs.rename(filename.newUri, filename.oldUri);
				}
			});
		});
		context.subscriptions.push(disposable);
	}
}

// This method is called when your extension is deactivated
export function deactivate() {
	fileManager.clear();
}
