import { IMutatableNode } from "../../interfaces/IMutatableNode";
import { IFileDescriptor } from "../../interfaces/IFileDescriptor";

import { FileObject } from "../../DTOs/FileObject";
import { SourceObject } from "../../DTOs/SourceObject";

import { CodeInspector } from "../CodeInspector/CodeInspector";
import { MutationFactory } from "../mutationFactory/MutationFactory";
import { ConfigManager } from "../configManager/ConfigManager";
import { FileHandler } from "../FileHandler/FileHandler";

export class NodeHandler {

    public static fileNameNodes: Array<IMutatableNode> = [];
    public static fileDescriptors: Array<IFileDescriptor> = [];

    public static traverseFilesForNodes () {
        for (let i = 0; i < ConfigManager.filesToMutate.length; i++) {
            NodeHandler.getAllNodesInFile(NodeHandler.fileDescriptors[i].codeInspector, i);
        }
        return NodeHandler.fileNameNodes;
    }

    public static getAllNodesInFile (codeInspector: CodeInspector, fileNameIndex: number): void {
        MutationFactory.mutatableTokens.forEach((syntaxItem) => {
            codeInspector.findObjectsOfSyntaxKind(syntaxItem).forEach((token) => {
                NodeHandler.fileNameNodes.push({
                    syntaxType: syntaxItem,
                    positions: token,
                    parentFileName: ConfigManager.filesToMutate[fileNameIndex]
                });
            });
        });
    }

    public static createAllFileDescriptors (): Array<IFileDescriptor> {
        for (let i = 0; i < ConfigManager.filesToMutate.length; i++) {
            const fo = new FileObject(ConfigManager.filesToMutate[i]);
            const fh = new FileHandler(fo);
            const so = new SourceObject(fh.getSourceObject());
            const ci = new CodeInspector(so.origionalSourceObject);
            NodeHandler.fileDescriptors.push({
                    fileName: ConfigManager.filesToMutate[i],
                    fileObject: fo, fileHandler: fh, sourceObject: so, codeInspector: ci
            });
        }
        return NodeHandler.fileDescriptors;
    }

    public static getDescriptorByFileName (fileName: string): IFileDescriptor {
        console.log(NodeHandler.fileDescriptors);
        return NodeHandler.fileDescriptors.find((descriptor) => descriptor.fileName === fileName);
    }
}
