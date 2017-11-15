import { ITestResult } from "../../interfaces/ITestResult";
import * as fs from "memfs";
import { FileHandler } from "../FileHandler/FileHandler";

export class TestFileHandler {

    public testFiles: Array<string> = [];

    constructor (public testDirPath) {}

    public readTestFileDirectory () {
        let fileNames;
        fileNames = fs.readdirSync(this.testDirPath);
        if (fileNames.length > 0){
            this.addFiles(fileNames);
        } else {
            return false;
        }
    }

    public addFiles (arrayOfFileNames: Array<string>) {
        arrayOfFileNames.forEach((fileName) => {
            if (this.isTestFile(fileName)) {
                this.testFiles.push(this.testDirPath + fileName);
            }
        });
        if (this.testFiles.length === 0){
            throw new Error("Aborting test run, no test files found at: " + this.testDirPath);
        }
    }

    public isTestFile (filePath: string): boolean {
        return filePath.indexOf(FileHandler.M_TEST_FILE_SUFFIX) >= 0;
    }
}
