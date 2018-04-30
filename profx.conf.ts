export class Config {
    public static readonly CONFIG = {
        filePath: "./testProject/src/",
        testFilePath: "./testProject/src/",
        testFileExtension: ".spec",
        mutateAllFiles: true,
        filesToMutate: [],
        filesToSkip: [],
        testRunner: "mocha",
        runnerConfig: {
            reporter: "dot"
        }
    };
}
