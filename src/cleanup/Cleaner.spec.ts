import { expect } from "chai";
import { Cleaner } from "./Cleaner";

describe("Cleaner", () => {
    it("a filename that ends with the target extension is flagged as file to delete", () => {
        expect(Cleaner.isTestFile("itis.m.ts")).to.equal(true);
        expect(Cleaner.isTestFile("itis.spec.m.ts")).to.equal(true);
    });

    it("a filename that doesn't end with the target extension is not flagged as file to delete", () => {
        expect(Cleaner.isTestFile("itis.mx.ts")).to.equal(false);
        expect(Cleaner.isTestFile("itis.spec.mx.ts")).to.equal(false);
    });
});
