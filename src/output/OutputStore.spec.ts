import { expect } from "chai";

import { ITestResult } from "../../interfaces/ITestResult";
import { OutputStore } from "./OutputStore";

describe("Output Store", () => {
    let outputStore: OutputStore;
    const origionalCode = `export class HelloWorld {
        public addNumbers (a: number, b: number) {
            return a + b;
        }
    }`;
    const firstLine = "export class HelloWorld {";
    const testResult: ITestResult = {
        passed : "1",
        failed : "2",
        totalRan : "3",
        duration : "20"
    };

    beforeEach(() => {
        outputStore = new OutputStore();
    });


    it("should set origional code to the 0th line when given line 0", () => {
        outputStore.setLineNumber(0);
        outputStore.setOrigionalSourceCode(origionalCode);
        expect(outputStore.origionalCode).to.equal(firstLine);
    });


    it("should set origional code to the last line when line 4", () => {
        outputStore.setLineNumber(4);
        outputStore.setOrigionalSourceCode(origionalCode);
        expect(outputStore.origionalCode.toString()).to.equal("}");
    });

    it("should set modified code to the 0th line when given line 0", () => {
        outputStore.setLineNumber(0);
        outputStore.setModifiedSourceCode(origionalCode);
        expect(outputStore.mutatedCode).to.equal(firstLine);
    });


    it("should set modified code to the last line when line 4", () => {
        outputStore.setLineNumber(4);
        outputStore.setModifiedSourceCode(origionalCode);
        expect(outputStore.mutatedCode).to.equal("}");
    });
});
