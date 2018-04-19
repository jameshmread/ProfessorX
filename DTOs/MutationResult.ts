import { IMutationResult } from "../interfaces/IMutationResult";
import { IMutationAttemptFailure } from "../interfaces/IMutationAttemptFailure";
import { IMutatableNode } from "../interfaces/IMutatableNode";
import { ConfigManager } from "../src/configManager/ConfigManager";
import { IMutationArrayAndClass } from "../interfaces/IMutationArrayandClass";

export class MutationResult implements IMutationResult {
    public readonly SRC_FILE_PATH: string;
    public readonly SRC_FILE: string;

    public testFilePath: string;
    public originalCode: Array<{ lineText: string, lineNumber: number }> = [];
    public mutatedCode: Array<{ lineText: string, lineNumber: number }> = [];

    public mutationAttemptFailure: IMutationAttemptFailure;

    public targetNode: string;
    public nodeModification: string;
    public mutationType: string;

    public constructor (
        node: IMutatableNode,
        mutationOption: IMutationArrayAndClass
    ) {
        this.SRC_FILE_PATH = ConfigManager.filePath;
        this.SRC_FILE = node.parentFilePath;
        this.targetNode = node.plainText;
        this.mutationType = mutationOption.mutationClass;
    }
}
