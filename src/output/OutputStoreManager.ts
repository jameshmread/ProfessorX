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
import { MathFunctions } from "../maths/MathFunctions";

export class OutputStoreManager {

    public static outputStoreList = new Array<OutputStore>();
    private currentOutputStore: OutputStore;

    public constructor (
    ) {
    }

    public static writeResults (collatedResults: EndResult) {
        const header = { runner: collatedResults.RUNNER, config: collatedResults.RUNNER_CONFIG };
        const results = collatedResults.RESULTS_ARRAY;
        const transformStream = JSONStream.stringify();
        const outputStream = fs.createWriteStream("./outputStoreData.json");

        transformStream.pipe(outputStream);

        transformStream.write(header);
        MathFunctions.divideItemsAmongArrays(results,
            Math.floor(results.length / 20)
        ).forEach((result) => {
            transformStream.write(result);
        });

        transformStream.end();
        outputStream.on("finish", () => {console.log("Results Written to Disk"); });
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
