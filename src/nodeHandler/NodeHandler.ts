import { IMutatableNode } from "../../interfaces/IMutatableNode";
import { IFileDescriptor } from "../../interfaces/IFileDescriptor";

import { FileObject } from "../../DTOs/FileObject";
import { SourceObject } from "../../DTOs/SourceObject";

import { CodeInspector } from "../CodeInspector/CodeInspector";
import { MutationFactory } from "../mutationFactory/MutationFactory";
import { ConfigManager } from "../configManager/ConfigManager";
import { FileHandler } from "../FileHandler/FileHandler";

export class NodeHandler {

    public fileNameNodes: Array<IMutatableNode> = [];
    public fileDescriptors: Array<IFileDescriptor> = [];

    public traverseFilesForNodes () {
        for (let i = 0; i < ConfigManager.filesToMutate.length; i++) {
            this.getAllNodesInFile(this.fileDescriptors[i].codeInspector, i);
        }
        return this.fileNameNodes;
    }

    public getAllNodesInFile (codeInspector: CodeInspector, fileNameIndex: number): void {
        MutationFactory.mutatableTokens.forEach((syntaxItem) => {
            codeInspector.findObjectsOfSyntaxKind(syntaxItem).forEach((token) => {
                this.fileNameNodes.push({
                    syntaxType: syntaxItem,
                    positions: token,
                    parentFileName: ConfigManager.filesToMutate[fileNameIndex]
                });
            });
        });
    }

    public createAllFileDescriptors (): Array<IFileDescriptor> {
        for (let i = 0; i < ConfigManager.filesToMutate.length; i++) {
            const fo = new FileObject(ConfigManager.filesToMutate[i]);
            const fh = new FileHandler(fo);
            const so = new SourceObject(fh.getSourceObject());
            const ci = new CodeInspector(so.origionalSourceObject);
            this.fileDescriptors.push({
                    fileName: ConfigManager.filesToMutate[i],
                    fileObject: fo, fileHandler: fh, sourceObject: so, codeInspector: ci
            });
        }
        return this.fileDescriptors;
    }
}
