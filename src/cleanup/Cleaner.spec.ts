import { expect } from "chai";
import { Cleaner } from "./Cleaner";

describe("Cleaner", () => {

    it("should return true when given a source.m.ts file", () => {
        expect(Cleaner.isMutatedFile("HelloWorld.ts1C746.m.ts")).to.equal(true);
    });

    it("should return true when given a test.spec.m.ts file", () => {
        expect(Cleaner.isMutatedFile("source.spec.m.ts")).to.equal(true);
    });
    it("should return false when given a source.ts filename", () => {
        expect(Cleaner.isMutatedFile("test.ts")).to.equal(false);
    });

    it("should return false when given a test.spec.ts filename", () => {
        expect(Cleaner.isMutatedFile("test.spec.ts")).to.equal(false);
    });

    it("should return 0 files when looking in a directory .ts files", () => {
        const fileArray = ["./hello.ts", "./hello.spec.ts"];
        expect(Cleaner.filterMutatedFiles(fileArray).length).to.equal(0);
    });

    it("should return 2 files when looking in a directory with 2 m.ts files", () => {
        const fileArray = ["./hello.ts", "./hello.spec.ts", "./hello.m.ts", "./hello.spec.m.ts"];
        expect(Cleaner.filterMutatedFiles(fileArray).length).to.equal(2);
    });
});
