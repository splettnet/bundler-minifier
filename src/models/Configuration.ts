import { TextDocument, WorkspaceFolder, window, Uri, workspace } from 'vscode';
import { minify as min } from 'terser'
import { writeFile as wf } from 'fs'

export class Configuration {

    private _root: WorkspaceFolder; 

    private _BundleDefinitions : BundleDefinition[];
    public get BundleDefinitions() : BundleDefinition[] {
        return this._BundleDefinitions;
    }
    public set BundleDefinitions(v : BundleDefinition[]) {
        this._BundleDefinitions = v;
    }
    
    public static fromConfigFile(td: TextDocument, root: WorkspaceFolder): Configuration {
        let data : string = td.getText();
        let obj : any = JSON.parse(data);
        
        let bundleDefinitions : BundleDefinition[] = [];
        obj["bundles"].forEach((bundle: any) => {
            bundleDefinitions.push(new BundleDefinition(bundle.name, bundle.minify, bundle.files, root));
        });

        return new Configuration(bundleDefinitions, root);

    }

    private constructor(bundleDefinitions : BundleDefinition[], root: WorkspaceFolder){
        this._BundleDefinitions = bundleDefinitions;
        this._root = root;
    }

    public build(uri: Uri): void {
        this._BundleDefinitions.forEach(bundleDefinition => {
            if(bundleDefinition.containsFile(uri.fsPath))
                bundleDefinition.build();
        });
    }

}

class BundleDefinition {

    private _name : string;
    private _fullName: string;
    public get Name() : string {
        return this._name;
    }
    public set Name(v : string) {
        this._name = v;
    }

    private _minify : boolean;
    public get Minify() : boolean {
        return this._minify;
    }
    public set Minify(v : boolean) {
        this._minify = v;
    }

    private _files : { relative: string, full: string }[];
    public get Files() : { relative: string, full: string }[] {
        return this._files;
    }
    public set Files(v : { relative: string, full: string }[]) {
        this._files = v;
    }
    
    constructor(name: string, minify: boolean, files: string[], root: WorkspaceFolder){
        this._name = name;
        this._fullName = root.uri.fsPath + "\\" + name;
        this._minify = minify;
        this._files = [];

        files.forEach(file => {
           this._files.push({ relative: file, full: root.uri.fsPath + "\\" + file }); 
        });
    }
    
    public containsFile(file: string): boolean{
        return this._files.filter(f => f.full.toLowerCase() == file.toLowerCase()).length != 0;
    }

    public async build(): Promise<void>{
        let code: string[] = [];
        
        for(let i: number = 0; i < this._files.length; i++){
            let td = await workspace.openTextDocument(this._files[i].full);
            code.push(td.getText());
        }

        let combined = this._minify ? min(code).code : code.join("\n");
        wf(this._fullName, combined, () => true);
    }
}