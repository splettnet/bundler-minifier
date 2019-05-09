"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const Configuration_1 = require("./models/Configuration");
let configFile;
let config;
let root;
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof vscode.workspace.workspaceFolders === "undefined")
            return;
        root = vscode.workspace.workspaceFolders[0];
        configFile = yield vscode.workspace.openTextDocument(root.uri.fsPath + "/.bunmin");
        let updateConfig = () => config = Configuration_1.Configuration.fromConfigFile(configFile, root);
        updateConfig();
        let fswBunmin = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(root, ".bunmin"), false, false, true);
        fswBunmin.onDidChange(updateConfig);
        fswBunmin.onDidCreate(updateConfig);
        let build = (uri) => __awaiter(this, void 0, void 0, function* () { return config.build(uri); });
        let fsw = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(root, "**/*.{js,css}"), false, false, true);
        fsw.onDidChange(build);
    });
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
function isConfigFile(td) {
    return td.fileName.endsWith("\.bunmin");
}
//# sourceMappingURL=extension.js.map