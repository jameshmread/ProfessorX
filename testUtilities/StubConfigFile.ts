import { IConfigFile } from "../interfaces/IConfigFile";

export class StubConfigFile {

    public static configFile: IConfigFile = {
        filesToMutate: [],
        mutateAllFiles: true,
        filesToSkip: [],
        runnerConfig: {}, filePath: "./testProject/src/",
        testFileExtension: ".spec", testFilePath: "./testProject/src/",
        testRunner: "mocha"
    };
}
