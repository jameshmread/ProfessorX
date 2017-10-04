import { FileHandler } from "./FileHandler";
import { expect } from "chai";
import * as fs from "fs";

describe("Testing FileHandler", () => {
    const fh = new FileHandler("./src/FileHandler/", "FileHandler.ts");
    it("creating a new instance should throw an error if the file doesn't end with .ts", () => {
        expect(() =>  new FileHandler("./src/FileHandler/", "file")).to.throw(Error);
    });
    it("creating a new instance should throw an error if the file doesn't exist", () => {
        expect(() =>  new FileHandler("./src/FileHandler/", "file.ts")).to.throw(Error);
    });

    it("creating a new instance should work if file is .ts and exists and has a matching test file", () => {
        expect(() =>  new FileHandler("./src/FileHandler/", "FileHandler.ts")).not.to.throw(Error);
    });

    it("reading the source code of an existing file should work", () => {
        expect(fh.getSourceCode()).to.not.eql(void 0);
    });

    it("retrieving the AST of an existing file should work", () => {
        expect(fh.getSourceObject()).to.not.eql(void 0);
    });

    it("modifying the reference of a test file to the mutated code should work", () => {
        expect(fh.mutateTestFileReference(`import { FileHandler } from "./FileHandler";`)).to.eql
            (`import { FileHandler } from "./FileHandler.ts0.m";`);
    });

    it("modifying the reference of a test file to the mutated code should work", () => {
        const fileHandler = new FileHandler("./testProject/src/", "HelloWorld.ts");
        expect(fileHandler.mutateTestFileReference(`import { HelloWorld } from "./HelloWorld";`)).to.eql
            (`import { HelloWorld } from "./HelloWorld.ts0.m";`);
    });

});
