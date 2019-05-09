import * as vscode from 'vscode';
import { Configuration } from './models/Configuration';

let configFile : vscode.TextDocument;
let config : Configuration;
let root : vscode.WorkspaceFolder;


export async function activate(context: vscode.ExtensionContext) {
	
	if (typeof vscode.workspace.workspaceFolders === "undefined")
		return;

	root = vscode.workspace.workspaceFolders[0];

	configFile = await vscode.workspace.openTextDocument(root.uri.fsPath + "/.bunmin");

	let updateConfig = () => config = Configuration.fromConfigFile(configFile, root);

	updateConfig();

	let fswBunmin = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(
		root, ".bunmin"), false, false, true);

	fswBunmin.onDidChange(updateConfig);
	fswBunmin.onDidCreate(updateConfig);

	let build = async (uri: vscode.Uri) => config.build(uri);
	
	let fsw = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(
		root, "**/*.{js,css}"), false, false, true);
	
	fsw.onDidChange(build);
}

export function deactivate() { }

function isConfigFile(td : vscode.TextDocument){
	return td.fileName.endsWith("\.bunmin");
}