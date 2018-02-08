import * as ts from "typescript";

import { ITestResult } from "../../interfaces/ITestResult";
import { IMutatableNode } from "../../interfaces/IMutatableNode";
import { MutationResult } from "../../DTOs/MutationResult";

import { SourceCodeHandler } from "../SourceCodeHandler/SourceCodeHandler";
import { EndResult } from "../../DTOs/EndResult";
import { MathFunctions } from "../maths/MathFunctions";

export class MutationResultManager {

    public static mutationResults = new Array<MutationResult>();
    private currentMutationResult: MutationResult;

    public constructor (
    ) {
    }

    public setCurrentMutationResult (mResult: MutationResult): void {
        this.currentMutationResult = mResult;
    }

    public getCurrentMutationResult (): MutationResult {
        return this.currentMutationResult;
    }

    public addMutationResultToList (): void {
        MutationResultManager.mutationResults.push(this.currentMutationResult);
    }

    public setMutationResultData (
        testFile: string,
        currentNode: IMutatableNode,
        sourceCodeHandler: SourceCodeHandler
    ) {
        this.setTestFile(testFile);
        this.setLineNumber(
            ts.getLineAndCharacterOfPosition(
                sourceCodeHandler.getOriginalSourceObject(),
                currentNode.positions["pos"]).line
        );
        this.setOrigionalSourceCode(sourceCodeHandler.getOriginalSourceCode());
        this.setModifiedSourceCode(sourceCodeHandler.getModifiedSourceCode());
    }

    public setTestFile (filename: string): void {
        this.currentMutationResult.testFilePath = filename;
    }

    public setLineNumber (lineNumber: number): void {
        this.currentMutationResult.lineNumber = lineNumber;
    }

    public setNumberOfTests (testResult: ITestResult): void {
        this.currentMutationResult.numberOfPassedTests = parseInt(testResult.passed, 0);
        this.currentMutationResult.numberOfFailedTests = parseInt(testResult.failed, 0);
        this.currentMutationResult.mutantKilled =
        this.wasMutantKilled(this.currentMutationResult.numberOfFailedTests);
    }

    public setOrigionalSourceCode (code: string): void {
        const codeLines = this.splitCodeByLine(code);
        this.currentMutationResult.origionalCode =
        codeLines[this.currentMutationResult.lineNumber].trim();
    }

    public setModifiedSourceCode (code: string): void {
        const codeLines = this.splitCodeByLine(code);
        this.currentMutationResult.mutatedCode =
        codeLines[this.currentMutationResult.lineNumber].trim();
    }

    // was the mutant killed? true is killed (good)
    public wasMutantKilled (failedTests: number): boolean {
        return failedTests > 0;
    }

    private splitCodeByLine (code: string): Array<string> {
        return code.split("\n");
    }
}
