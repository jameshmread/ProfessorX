import { IMutationResult } from "../interfaces/IMutationResult";
import { IMutationAttemptFailure } from "../interfaces/IMutationAttemptFailure";

export class MutationResult implements IMutationResult{
      public readonly SRC_FILE_PATH: string;
      public readonly SRC_FILE: string;

      public testFilePath: string;
      public origionalCode: Array<{lineText: string, lineNumber: number}> = [];
      public mutatedCode: Array<{lineText: string, lineNumber: number}> = [];

      public mutationAttemptFailure: IMutationAttemptFailure;

      public targetNode: string;
      public nodeModification: string;

      public constructor (
            srcPath: string,
            srcFile: string
        ) {
            this.SRC_FILE_PATH = srcPath;
            this.SRC_FILE = srcFile;
        }
}
