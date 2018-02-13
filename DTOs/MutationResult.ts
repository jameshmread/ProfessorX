import { IMutationAttemptFailure } from "../interfaces/IMutationAttemptFailure";

export class MutationResult {
      public readonly SRC_FILE_PATH: string;
      public readonly SRC_FILE: string;

      public testFilePath: string;
      public lineNumber: number;
      public origionalCode: string;
      public mutatedCode: string;
      public numberOfFailedTests: number;
      public numberOfPassedTests: number;
      public mutantKilled: boolean;

      public mutationAttemptFailure: IMutationAttemptFailure;

      public constructor (
            srcPath: string,
            srcFile: string
        ) {
            this.SRC_FILE_PATH = srcPath;
            this.SRC_FILE = srcFile;
        }
}
