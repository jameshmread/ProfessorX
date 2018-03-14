export class Config {
    public static readonly CONFIG = {
        filePath: "./testProject/src/",
        mutateAllFiles: true,
        filesToMutate: [],
        filesToSkip: ["SkipMe.ts"],
        testRunner: "mocha",
        runnerConfig: {
            reporter: "dot"
        }
    };
    public static readonly CONFIG_STRESS = {
        filePath: "./testProject-Stress/src/",
        mutateAllFiles: false,
        filesToMutate: [
            "FileTwo.ts",
            "FileOne.ts",
            "LargeFile.ts"
        ],
        filesToSkip: ["SkipMe.ts"],
        testRunner: "mocha",
        runnerConfig: {
            reporter: "dot"
        }
    };
}
