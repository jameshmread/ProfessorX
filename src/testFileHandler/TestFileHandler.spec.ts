import { expect } from "chai";

import { TestFileHandler } from "./TestFileHandler";
import { FileHandler } from "../FileHandler/FileHandler";

const extension = FileHandler.M_TEST_FILE_SUFFIX;

describe("Test File Handler", () => {
    let testFileHandler: TestFileHandler;
    const filename1 = "filename1" + extension;
    const filename2 = "filename2" + extension;
    beforeEach(() => {
        testFileHandler = new TestFileHandler("./testProject/src/");
    });

    it("when given 1 test file returns 1 filename", () => {
        const fakeFileNames = [filename1];
        testFileHandler.addFiles(fakeFileNames);
        expect(testFileHandler.testFiles.length).to.equal(1);
    });

    it("when given 2 test files returns 2 filenames", () => {
        const fakeFileNames = [filename1, filename2];
        testFileHandler.addFiles(fakeFileNames);
        expect(testFileHandler.testFiles.length).to.equal(2);
    });

    it("when given 2 test files returns file names equal inputed plus origional dir path", () => {
        const fakeFileNames = [filename1, filename2];
        testFileHandler.addFiles(fakeFileNames);
        expect(testFileHandler.testFiles[0]).to.equal(testFileHandler.testDirPath + fakeFileNames[0]);
        expect(testFileHandler.testFiles[1]).to.equal(testFileHandler.testDirPath + fakeFileNames[1]);
    });

    it("when given no file names, it should throw an error", () => {
        const noFileNames = [];
        expect(() => {
            testFileHandler.addFiles(noFileNames);
        }).to.throw();
    });

    it("a string of spec should return true", () => {
        const actual = testFileHandler.isTestFile(extension);
        expect(actual).to.equal(true);
    });

    it("a string containing .spec should return true", () => {
        const testSpecFile = "dir/lowerDir/filename.ts" + extension;
        const actual = testFileHandler.isTestFile(testSpecFile);
        expect(actual).to.equal(true);
    });

    it("a string without .spec should return false", () => {
        const testSpecFile = "dir/lowerDir/filename.ts";
        const actual = testFileHandler.isTestFile(testSpecFile);
        expect(actual).to.equal(false);
    });

    it("a string with spec in the file name return false", () => {
        const testSpecFile = "dir/lowerDir/Filenamespec.ts";
        const actual = testFileHandler.isTestFile(testSpecFile);
        expect(actual).to.equal(false);
    });

    it("should throw an error on a non existing filepath", () => {
        testFileHandler.testDirPath = "/////not a file path.ts";
        expect(() => {
            testFileHandler.readTestFileDirectory();
        }).to.throw(Error);
    });

    it("should throw an error on a non existing filepath", () => {
        testFileHandler.testDirPath = "./nonexist.ts";
        expect(() => {
            testFileHandler.readTestFileDirectory();
        }).to.throw(Error);
    });

});
