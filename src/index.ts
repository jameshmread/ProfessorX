import { IMutatableNode } from "../interfaces/IMutatableNode";
import { ConfigManager } from "./configManager/ConfigManager";
import { FileHandler } from "./FileHandler/FileHandler";
import { CodeInspector } from "./CodeInspector/CodeInspector";
import { SourceCodeHandler } from "./SourceCodeHandler/SourceCodeHandler";
import { OutputStoreManager } from "./output/OutputStoreManager";
import { MutationFactory } from "./mutationFactory/MutationFactory";
import { Supervisor } from "./Supervisor";

import { SourceObject } from "../DTOs/SourceObject";
import { OutputStore } from "../DTOs/OutputStore";
import { FileObject } from "../DTOs/FileObject";
import { IFileDescriptor } from "../interfaces/IFileDescriptor";

export class ProfessorX {

    public fileNameNodes = new Array<IMutatableNode>();
    public fileDescriptors: Array<IFileDescriptor>;
    public supervisor: Supervisor;

    public constructor () {
        console.log("Setting up environment. \n");
        const configManager = new ConfigManager();
        ConfigManager.getFilesToMutate();
        this.fileDescriptors = new Array<IFileDescriptor>();
    }

    public async main () {
        // will be mutateFiles -> mutateNodesInsideFiles
        console.log("Creating File Objects");
        this.createAllFileDescriptors();
        console.log("Finding Nodes... \n");
        this.traverseFiles();
        console.log("Found ", this.fileNameNodes.length, " mutatable nodes. ");
        console.log("In ", ConfigManager.filesToMutate.length, " Files \n");
        console.log("filename nodes ", this.fileNameNodes);
        this.supervisor = new Supervisor(this.fileNameNodes);
    }
    // have to do this twice....
    private createAllFileDescriptors (): Array<IMutatableNode> {
        const fileDescriptors = new Array<IMutatableNode>();
        for (let i = 0; i < ConfigManager.filesToMutate.length; i++) {
            const fo = new FileObject(ConfigManager.filePath, ConfigManager.filesToMutate[i]);
            const fh = new FileHandler(fo);
            const so = new SourceObject(fh.getSourceObject());
            const ci = new CodeInspector(so.origionalSourceObject);
            this.fileDescriptors.push({
                    fileName: ConfigManager.filesToMutate[i],
                    fileObject: fo, fileHandler: fh, sourceObject: so, codeInspector: ci
            });
        }
        return fileDescriptors;
    }

    private traverseFiles () {
        for (let i = 0; i < ConfigManager.filesToMutate.length; i++) {
                this.getAllNodesInFile(this.fileDescriptors[i].codeInspector, i);
        }
    }

    private getAllNodesInFile (codeInspector: CodeInspector, i: number): void{
        MutationFactory.mutatableTokens.forEach((syntaxItem) => {
            codeInspector.findObjectsOfSyntaxKind(syntaxItem).forEach((token) => {
                this.fileNameNodes.push({
                            syntaxType : syntaxItem,
                            positions : token,
                            parentFileName: ConfigManager.filesToMutate[i]
                });
            });
        });
    }
}
const x = new ProfessorX();
x.main();
