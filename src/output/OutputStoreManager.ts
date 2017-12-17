import * as fs from "fs";
import * as ts from "typescript";

import { ITestResult } from "../../interfaces/ITestResult";
import { OutputStore } from "../../DTOs/OutputStore";
import { IDurationFormat } from "../../interfaces/IDurationFormat";
import { IMutatableNode } from "../../interfaces/IMutatableNode";
import { SourceCodeHandler } from "../SourceCodeHandler/SourceCodeHandler";

export class OutputStoreManager {

    public static outputStoreList = new Array<OutputStore>();
    private currentOutputStore: OutputStore;

    public constructor (
    ) {}

    public static writeOutputStoreToJson (collatedResults) {
        fs.writeFileSync("./srcApp/app/outputStoreData.json",
        JSON.stringify(collatedResults, null, 2));
    }

    public static setRunTime (runTime: number): IDurationFormat {
        /*
            convert millis to date time adapted from
            https://gist.github.com/remino/1563878
        */
        let ms = runTime;
        ms = ms % 1000;
        let s = Math.floor(runTime / 1000);
        let m = Math.floor(s / 60);
        s = s % 60;
        let h = Math.floor(m / 60);
        m = m % 60;
        const d = Math.floor(h / 24);
        h = h % 24;
        this.writeDataToJson({ d, h, m, s, ms });
        return { d, h, m, s, ms };
    }

    public setCurrentOutputStore (outputStore: OutputStore): void {
        this.currentOutputStore = outputStore;
    }

    public addStoreToList (): void {
        OutputStoreManager.outputStoreList.push(this.currentOutputStore);
    }

    public configureStoreData (
        testFile: string,
        currentNode: IMutatableNode,
        sourceCodeHandler: SourceCodeHandler
    ) {
        this.setTestFile(testFile);
        // consider setting test file once per file since it is just duplication
        this.setLineNumber(
            ts.getLineAndCharacterOfPosition(
                sourceCodeHandler.getOriginalSourceObject(),
                currentNode.positions["pos"]).line
        );
        this.setOrigionalSourceCode(sourceCodeHandler.getOriginalSourceCode());
        this.setModifiedSourceCode(sourceCodeHandler.getModifiedSourceCode());
    }

    public setTestFile (filename: string): void {
        this.currentOutputStore.testFilePath = filename;
    }

    public setLineNumber (lineNumber: number): void {
        this.currentOutputStore.lineNumber = lineNumber;
    }

    public setNumberOfTests (testResult: ITestResult): void {
        this.currentOutputStore.numberOfPassedTests = parseInt(testResult.passed, 0);
        this.currentOutputStore.numberOfFailedTests = parseInt(testResult.failed, 0);
        this.currentOutputStore.mutantKilled =
        this.wasMutantKilled(this.currentOutputStore.numberOfFailedTests);
    }

    public setOrigionalSourceCode (code: string): void {
        const codeLines = this.splitCodeByLine(code);
        this.currentOutputStore.origionalCode =
        codeLines[this.currentOutputStore.lineNumber].trim();
    }

    public setModifiedSourceCode (code: string): void {
        const codeLines = this.splitCodeByLine(code);
        this.currentOutputStore.mutatedCode =
        codeLines[this.currentOutputStore.lineNumber].trim();
    }

    // was the mutant killed? true is killed (good)
    public wasMutantKilled (failedTests: number): boolean {
        return failedTests > 0;
    }

    private static writeDataToJson (data: IDurationFormat) {
        fs.writeFileSync("./srcApp/app/data.json", JSON.stringify(data, null, 2));
    }

    private splitCodeByLine (code: string): Array<string> {
        return code.split("\n");
    }
}
