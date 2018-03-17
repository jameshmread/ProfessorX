import * as ts from "typescript";

import { ITestResult } from "../../interfaces/ITestResult";
import { IMutatableNode } from "../../interfaces/IMutatableNode";
import { MutationResult } from "../../DTOs/MutationResult";

import { SourceCodeModifier } from "../sourceCodeModifier/SourceCodeModifier";
import { CodeInspector } from "../CodeInspector/CodeInspector";
import { Logger } from "../logging/Logger";

export class MutationResultManager {

    public static mutationResults = new Array<MutationResult>();
    private currentMutationResult: MutationResult;
    private sourceCodeModifier: SourceCodeModifier;
    private currentSourceCodeObject: ts.SourceFile;
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

    public setCurrentSourceCodeModifierAndSourceObj (sourceCodeModifier: SourceCodeModifier) {
        this.sourceCodeModifier = sourceCodeModifier;
        this.currentSourceCodeObject = sourceCodeModifier.getOriginalSourceObject();
    }

    public setMutationResultData (
        testFile: string,
        currentNode: IMutatableNode
    ) {
        this.setTestFile(testFile);
        const methodBounds = this.getParentMethodBoundsOfMutatedLine(currentNode.positions.pos);

        this.setSourceCodeLines(
            {origional: this.sourceCodeModifier.getOriginalSourceCode(),
                mutated: this.sourceCodeModifier.getModifiedSourceCode()},
                methodBounds);
    }

    public setTestFile (filename: string): void {
        this.currentMutationResult.testFilePath = filename;
    }

    public setNumberOfTests (testResult: ITestResult): void {
        this.currentMutationResult.numberOfPassedTests = parseInt(testResult.passed, 0);
        this.currentMutationResult.numberOfFailedTests = parseInt(testResult.failed, 0);
        this.currentMutationResult.mutantKilled =
        this.wasMutantKilled(this.currentMutationResult.numberOfFailedTests);
    }

    public setSourceCodeLines (
        code: {origional: string, mutated: string},
        bounds: {pos: number, end: number}
    ): void {
        try {
            const methodStartLine = ts.getLineAndCharacterOfPosition(this.currentSourceCodeObject, bounds.pos).line;
            const methodEndLine = ts.getLineAndCharacterOfPosition(this.currentSourceCodeObject, bounds.end).line;
            this.setOrigionalCode(code.origional, {start: methodStartLine, end: methodEndLine});
            this.setMutatedCode(code.mutated, {start: methodStartLine, end: methodEndLine});
        } catch (error) {
            Logger.fatal("Mutation result Manager could not set source code lines", error);
            throw Error("Could not set source code lines" + error);
        }
    }

    // was the mutant killed? true is killed (good)
    public wasMutantKilled (failedTests: number): boolean {
        return failedTests > 0;
    }

    public getParentMethodBoundsOfMutatedLine (characterOfMutation: number) {
        return this.getAllMethodNames().filter((methods) =>
        methods.pos <= characterOfMutation && methods.end >= characterOfMutation)[0];
    }

    public getAllMethodNames () {
        const inspector = new CodeInspector(this.currentSourceCodeObject);
        return inspector.findObjectsOfSyntaxKind(ts.SyntaxKind.MethodDeclaration)
        .map((obj) => obj = {pos: 2 + obj.pos, end: obj.end} );
    }

    private setOrigionalCode (code: string, method: {start: number, end: number}) {
        const splitCode = this.splitCodeByLine(code);
        for (let line = method.start; line < method.end + 1; line++) {
            this.currentMutationResult.origionalCode.push({
                lineText: splitCode[line],
                lineNumber: ++ method.start
            });
        }
    }

    private setMutatedCode (code: string, method: {start: number, end: number}) {
        const splitCode = this.splitCodeByLine(code);
        for (let line = method.start; line < method.end + 1; line++) {
            this.currentMutationResult.mutatedCode.push({
                lineText: splitCode[line],
                lineNumber: ++ method.start
            });
        }
    }

    private splitCodeByLine (code: string): Array<string> {
        return code.split("\n");
    }
}
