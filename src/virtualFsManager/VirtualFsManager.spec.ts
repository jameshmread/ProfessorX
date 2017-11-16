import * as ts from "typescript";
import { expect } from "chai";
import { VirtualFsManager } from "./VirtualFsManager";

describe("Testing Virtual FS Manager", () => {

    let vfs: VirtualFsManager;

    beforeEach(() => {
        vfs = new VirtualFsManager("./testProject/src/");
        VirtualFsManager.sourceFiles = [];
        VirtualFsManager.testFiles = [];
    });

    it("returns false with a js file", () => {
      expect(vfs.isTypescriptSourceFile("hey.js")).to.equal(false);
    });

    it("returns true with a ts file", () => {
        expect(vfs.isTypescriptSourceFile("hey.ts")).to.equal(true);
    });

    it("returns false with a filename containing ts", () => {
        expect(vfs.isTypescriptSourceFile("hey.ts.js")).to.equal(false);
    });

    it("returns false with a ts spec file", () => {
        expect(vfs.isTypescriptSourceFile("hey.spec.ts")).to.equal(false);
    });

    it("returns false with a ts src file", () => {
        expect(vfs.isTypescriptTestFile("hey.ts")).to.equal(false);
    });

    it("returns true with a ts spec file", () => {
        expect(vfs.isTypescriptTestFile("hey.spec.ts")).to.equal(true);
    });

    it("returns false with a filename containing spec", () => {
        expect(vfs.isTypescriptTestFile("heyspec.ts")).to.equal(false);
    });

    it("should create 2 arrays of 1 length with one test file and source", () => {
            vfs.getProjectFiles();
            expect(VirtualFsManager.sourceFiles.length).to.equal(1);
            expect(VirtualFsManager.testFiles.length).to.equal(1);
    });
});
