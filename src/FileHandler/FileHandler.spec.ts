import { expect } from "chai";

import { FileHandler } from "./FileHandler";
import { FileObject } from "../../DTOs/FileObject";
import { ConfigManager } from "../configManager/ConfigManager";
import { StubConfigFile } from "../../testUtilities/StubConfigFile";

describe("Testing FileHandler", () => {
    const configManager = new ConfigManager(StubConfigFile.configFile);
    const fh = new FileHandler(new FileObject("HelloWorld.ts"));

    it("creating a new instance should throw an error if the file doesn't end with .ts", () => {
        expect(() =>  new FileHandler(new FileObject("file"))).to.throw(Error);
    });

    it("creating a new instance should throw an error if the file doesn't exist", () => {
        expect(() =>  new FileHandler(new FileObject("file.ts"))).to.throw(Error);
    });

    it("creating a new instance should work if file is .ts and exists and has a matching test file", () => {
        expect(() =>  new FileHandler(new FileObject("HelloWorld.ts"))).not.to.throw(Error);
    });

    it("reading the source code of an existing file should work", () => {
        expect(fh.getSourceCode()).to.not.eql(void 0);
    });

    it("retrieving the AST of an existing file should work", () => {
        expect(fh.getSourceObject()).to.not.eql(void 0);
    });

    it("modifying the reference of a test file to the mutated code should work", () => {
        expect(fh.mutateTestFileReference(`import { HelloWorld } from "./HelloWorld";`)).to.eql
            (`import { HelloWorld } from "./HelloWorld.ts0C0.m";`);
    });

    it("modifying the reference of a test file to the mutated code should work", () => {
        const fileHandler = new FileHandler(new FileObject("HelloWorld.ts"));
        expect(fileHandler.mutateTestFileReference(`import { HelloWorld } from "./HelloWorld";`)).to.eql
            (`import { HelloWorld } from "./HelloWorld.ts0C0.m";`);
    });

});
