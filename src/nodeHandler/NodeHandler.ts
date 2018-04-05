import { IMutatableNode } from "../../interfaces/IMutatableNode";
import { IFileDescriptor } from "../../interfaces/IFileDescriptor";

import { FileObject } from "../../DTOs/FileObject";
import { SourceObject } from "../../DTOs/SourceObject";

import { CodeInspector } from "../CodeInspector/CodeInspector";
import { MutationFactory } from "../mutationFactory/MutationFactory";
import { ConfigManager } from "../configManager/ConfigManager";
import { FileHandler } from "../FileHandler/FileHandler";
import { Logger } from "../logging/Logger";
import { exists, existsSync } from "fs";

export class NodeHandler {

    public static fileNameNodes: Array<IMutatableNode> = [];
    public static fileDescriptors: Array<IFileDescriptor> = [];

    public static traverseFilesForNodes () {
        for (let i = 0; i < ConfigManager.filesToMutate.length; i++) {
            NodeHandler.getAllNodesInFile(NodeHandler.fileDescriptors[i].codeInspector, i);
        }
        if (this.fileNameNodes.length === 0) {
            Logger.fatal("No nodes found to mutate, check Professor X config settings.", NodeHandler);
            throw Error("No nodes found to mutate, check Professor X config settings.");
        }
        Logger.info("Found Nodes", NodeHandler.fileNameNodes.length);
        return NodeHandler.fileNameNodes;
    }

    public static getAllNodesInFile (codeInspector: CodeInspector, fileNameIndex: number): void {
        MutationFactory.mutatableTokens.forEach((syntaxItem) => {
            codeInspector.findObjectsOfSyntaxKind(syntaxItem).forEach((token) => {
                NodeHandler.fileNameNodes.push({
                    syntaxType: syntaxItem,
                    positions: {pos: token.pos, end: token.end},
                    parentFilePath: ConfigManager.filesToMutate[fileNameIndex],
                    plainText: token.getText(),
                    associatedTestFilePath: ConfigManager.testFiles[fileNameIndex]
                });
            });
        });
    }

    public static createAllFileDescriptors (): Array<IFileDescriptor> {
        for (let i = 0; i < ConfigManager.filesToMutate.length; i++) {
            const fo = new FileObject(ConfigManager.filesToMutate[i], ConfigManager.testFiles[i]);
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
}
