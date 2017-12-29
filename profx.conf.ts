export class Config {
    public static readonly CONFIG = {
        filePath: "./testProject/src/",
        mutateAllFiles: true,
        filesToMutate: [
            "HelloWorld.ts",
            "FileTwo.ts",
            "SkipMe.ts"
        ],
        filesToSkip: ["SkipMe.ts"],
        testRunner: "mocha",
        runnerConfig: {
            reporter: "dot"
        }
    };
}
