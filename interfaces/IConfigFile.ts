export interface IConfigFile {
        filePath: string;
        testFilePath: string;
        testFileExtension: string;
        mutateAllFiles: boolean;
        filesToMutate: Array<string>;
        filesToSkip: Array<string>;
        testRunner: string;
        runnerConfig: Object;
        outputFormat: Array<string>;
}
