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
const vscode_1 = require("vscode");
const terser_1 = require("terser");
const fs_1 = require("fs");
class Configuration {
    get BundleDefinitions() {
        return this._BundleDefinitions;
    }
    set BundleDefinitions(v) {
        this._BundleDefinitions = v;
    }
    static fromConfigFile(td, root) {
        let data = td.getText();
        let obj = JSON.parse(data);
        let bundleDefinitions = [];
        obj["bundles"].forEach((bundle) => {
            bundleDefinitions.push(new BundleDefinition(bundle.name, bundle.minify, bundle.files, root));
        });
        return new Configuration(bundleDefinitions, root);
    }
    constructor(bundleDefinitions, root) {
        this._BundleDefinitions = bundleDefinitions;
        this._root = root;
    }
    build(uri) {
        this._BundleDefinitions.forEach(bundleDefinition => {
            if (bundleDefinition.containsFile(uri.fsPath))
                bundleDefinition.build();
        });
    }
}
exports.Configuration = Configuration;
class BundleDefinition {
    get Name() {
        return this._name;
    }
    set Name(v) {
        this._name = v;
    }
    get Minify() {
        return this._minify;
    }
    set Minify(v) {
        this._minify = v;
    }
    get Files() {
        return this._files;
    }
    set Files(v) {
        this._files = v;
    }
    constructor(name, minify, files, root) {
        this._name = name;
        this._fullName = root.uri.fsPath + "\\" + name;
        this._minify = minify;
        this._files = [];
        files.forEach(file => {
            this._files.push({ relative: file, full: root.uri.fsPath + "\\" + file });
        });
    }
    containsFile(file) {
        return this._files.filter(f => f.full.toLowerCase() == file.toLowerCase()).length != 0;
    }
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            let code = [];
            for (let i = 0; i < this._files.length; i++) {
                let td = yield vscode_1.workspace.openTextDocument(this._files[i].full);
                code.push(td.getText());
            }
            let combined = this._minify ? terser_1.minify(code).code : code.join("\n");
            fs_1.writeFile(this._fullName, combined, () => true);
        });
    }
}
//# sourceMappingURL=Configuration.js.map