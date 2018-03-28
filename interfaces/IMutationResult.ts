import { IMutationAttemptFailure } from "../interfaces/IMutationAttemptFailure";

export interface IMutationResult {
    SRC_FILE_PATH: string;
    SRC_FILE: string;

    testFilePath: string;
    origionalCode: Array<{ lineText: string, lineNumber: number }>;
    mutatedCode: Array<{ lineText: string, lineNumber: number }>;

    mutationAttemptFailure: IMutationAttemptFailure;

    targetNode: string;
    nodeModification: string;
    mutationType: string;
}
