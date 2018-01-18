import { IMutatableNode } from "../../interfaces/IMutatableNode";
import { IFileDescriptor } from "../../interfaces/IFileDescriptor";

import { CodeInspector } from "../CodeInspector/CodeInspector";
import { MutationFactory } from "../mutationFactory/MutationFactory";
import { ConfigManager } from "../configManager/ConfigManager";

export class NodeHandler {

    public fileNameNodes: Array<IMutatableNode> = [];

    constructor (private fileDescriptors: Array<IFileDescriptor>) {}

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
}
