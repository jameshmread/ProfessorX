import * as fs from "fs";
import * as ts from "typescript";
import * as JSONStream from "JSONStream";

import { ITestResult } from "../../interfaces/ITestResult";
import { IDurationFormat } from "../../interfaces/IDurationFormat";
import { IMutatableNode } from "../../interfaces/IMutatableNode";
import { OutputStore } from "../../DTOs/OutputStore";

import { SourceCodeHandler } from "../SourceCodeHandler/SourceCodeHandler";
import { EndResult } from "../../DTOs/EndResult";
import { Stream } from "stream";

export class OutputStoreManager {

    public static outputStoreList = new Array<OutputStore>();
    private currentOutputStore: OutputStore;

    public constructor (
    ) {
    }

    public static writeOutputStoreToJson (collatedResults: EndResult) {
        const header = { runner: collatedResults.RUNNER, config: collatedResults.RUNNER_CONFIG };
        const results = collatedResults.RESULTS_ARRAY;
        const transformStream = JSONStream.stringify();
        const outputStream = fs.createWriteStream("./outputStoreData.json");

        transformStream.pipe(outputStream);

        transformStream.write(header);
        OutputStoreManager.divideResults(collatedResults.RESULTS_ARRAY).forEach((result) => {
            transformStream.write(result);
        });

        transformStream.end();
        outputStream.on("finish", () => {console.log("Results Written to Disk"); });
    }

    public static divideResults (resultsArray: Array<OutputStore>) {
        const divisionLength = Math.floor(resultsArray.length / 20);
        const dividedResults = new Array<Array<OutputStore>>();
        for (let i = 0; i < resultsArray.length; i++) {
            if (dividedResults[i] === void 0 && i < divisionLength) {
                dividedResults[i % divisionLength] = [];
            }
            dividedResults[i % divisionLength].push(resultsArray[i]);
        }
        return dividedResults;
    }

    public static calculateRunTime (runTime: number): IDurationFormat {
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
        return { d, h, m, s, ms };
    }

    public static writeDataToJson (data: IDurationFormat) {
        fs.writeFileSync("./data.json", JSON.stringify(data, null, 2));
    }

    public setCurrentOutputStore (outputStore: OutputStore): void {
        this.currentOutputStore = outputStore;
    }

    public getCurrentOutputStore (): OutputStore {
        return this.currentOutputStore;
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


    private splitCodeByLine (code: string): Array<string> {
        return code.split("\n");
    }
}
