import { expect } from "chai";
import { Cleaner } from "./Cleaner";
import { FileHandler } from "../FileHandler/FileHandler";
import * as fs from "fs";


describe("Cleaner", () => {
    let cleaner: Cleaner;
    const suffix = FileHandler.M_TEST_FILE_SUFFIX;
    const testFileDir = "./testProject/src/";
    beforeEach(() => {
    });

    it("finds no files when there are none with the M test file suffix", () => {
        cleaner = new Cleaner("./testProject/");
        cleaner.findMutatedFiles();
        expect(cleaner.filesToDelete.length).to.equal(0);
    });

    it("a filename that ends with the target extension is flagged as file to delete", () => {
        cleaner = new Cleaner("./testProject/");
        expect(cleaner.isTestFile("itis.m.ts")).to.equal(true);
        expect(cleaner.isTestFile("itis.spec.m.ts")).to.equal(true);
    });

    it("a filename that doesn't end with the target extension is not flagged as file to delete", () => {
        cleaner = new Cleaner("./testProject/");
        expect(cleaner.isTestFile("itis.mx.ts")).to.equal(false);
        expect(cleaner.isTestFile("itis.spec.mx.ts")).to.equal(false);
    });

});
