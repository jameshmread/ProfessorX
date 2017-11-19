export class OutputStore {
      public readonly SRC_FILE_PATH: string;
      public readonly SRC_FILE: string;
      public readonly RUNNER: string;
      public readonly RUNNER_CONFIG: Object;

      public testFilePath: string;
      public lineNumber: number;
      public origionalCode: string;
      public mutatedCode: string;
      public numberOfFailedTests: number;
      public numberOfPassedTests: number;
      public mutantKilled;

      public constructor (
            srcPath: string,
            srcFile: string,
            testRunner: string,
            runnerConfig: Object
        ) {
            this.SRC_FILE_PATH = srcPath;
            this.SRC_FILE = srcFile;
            this.RUNNER = testRunner;
            this.RUNNER_CONFIG = runnerConfig;
        }
}
