import * as ts from "typescript";

import { ITestResult } from "../../interfaces/ITestResult";
import { IMutatableNode } from "../../interfaces/IMutatableNode";
import { MutationResult } from "../../DTOs/MutationResult";

import { SourceCodeModifier } from "../sourceCodeModifier/SourceCodeModifier";
import { CodeInspector } from "../CodeInspector/CodeInspector";

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
        this.setLineNumber(
            ts.getLineAndCharacterOfPosition(
                this.sourceCodeModifier.getOriginalSourceObject(),
                currentNode.positions.pos).line
        );
        const methodBounds = this.getParentMethodBoundsOfMutatedLine(currentNode.positions.pos);

        this.setSourceCodeLines(
            {origional: this.sourceCodeModifier.getOriginalSourceCode(),
                mutated: this.sourceCodeModifier.getModifiedSourceCode()},
                methodBounds);
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

    public setSourceCodeLines (
        code: {origional: string, mutated: string},
        bounds: {pos: number, end: number}
    ): void {
        const methodStartLine = ts.getLineAndCharacterOfPosition(this.currentSourceCodeObject, bounds.pos).line;
        const methodEndLine = ts.getLineAndCharacterOfPosition(this.currentSourceCodeObject, bounds.end).line;

        const origionalCodeLines = this.splitCodeByLine(code.origional);
        const mutatedCodeLines = this.splitCodeByLine(code.mutated);
        for (let line = methodStartLine; line < methodEndLine + 1; line++) {
            this.currentMutationResult.origionalCode.push(origionalCodeLines[line].trim());
            if (mutatedCodeLines[line] !== void 0) {
                this.currentMutationResult.mutatedCode.push(mutatedCodeLines[line].trim());
            }
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


    private splitCodeByLine (code: string): Array<string> {
        return code.split("\n");
    }
}
