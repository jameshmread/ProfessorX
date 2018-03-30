import * as ts from "typescript";

import { ITestResult } from "../../interfaces/ITestResult";
import { IMutatableNode } from "../../interfaces/IMutatableNode";
import { MutationResult } from "../../DTOs/MutationResult";

import { SourceCodeModifier } from "../sourceCodeModifier/SourceCodeModifier";
import { CodeInspector } from "../CodeInspector/CodeInspector";
import { Logger } from "../logging/Logger";
import { MAttemptFail } from "../../DTOs/MAttemptFail";

export class MutationResultManager {

    public static mutationResults = new Array<MutationResult>();

    private currentMutationResult: MutationResult;
    private sourceCodeModifier: SourceCodeModifier;
    private currentSourceCodeObject: ts.SourceFile;

    public setCurrentMutationResult (mResult: MutationResult): void {
        this.currentMutationResult = mResult;
    }

    public getCurrentMutationResult (): MutationResult {
        return this.currentMutationResult;
    }

    public addMutationResultToList (): void {
        if (MutationResultManager.mutationResults.indexOf(this.currentMutationResult) < 0) {
            MutationResultManager.mutationResults.push(this.currentMutationResult);
        }
    }

    public setCurrentSourceCodeModifierAndSourceObj (sourceCodeModifier: SourceCodeModifier) {
        this.sourceCodeModifier = sourceCodeModifier;
        this.currentSourceCodeObject = sourceCodeModifier.getOriginalSourceObject();
    }

    public setMutationResultData (testFile: string, currentNode: IMutatableNode) {
        this.setTestFile(testFile);
        try {
            const methodBounds = this.getParentMethodBoundsOfMutatedLine(currentNode.positions.pos);
            this.setSourceCodeLines(
                {origional: this.sourceCodeModifier.getOriginalSourceCode(),
                    mutated: this.sourceCodeModifier.getModifiedSourceCode()},
                    methodBounds);
        } catch (err) {
            this.currentMutationResult.mutationAttemptFailure = new MAttemptFail(
                `The current nodes 'Start' and 'End' positions were undefined.
                Or the method bounds for these positions could not be determined`,
                currentNode.plainText,
                currentNode
            );
        }
    }

    public setTestFile (filename: string): void {
        this.currentMutationResult.testFilePath = filename;
    }

    public setSourceCodeLines (
        code: {origional: string, mutated: string},
        bounds: {pos: number, end: number}): void {
            const methodStartLine = ts.getLineAndCharacterOfPosition(this.currentSourceCodeObject, bounds.pos).line;
            const methodEndLine = ts.getLineAndCharacterOfPosition(this.currentSourceCodeObject, bounds.end).line;
            this.setOrigionalCode(code.origional, {start: methodStartLine, end: methodEndLine});
            this.setMutatedCode(code.mutated, {start: methodStartLine, end: methodEndLine});
    }

    public getParentMethodBoundsOfMutatedLine (characterOfMutation: number) {
        const methodBounds = this.getAllMethodNames().filter((methods) =>
        methods.pos <= characterOfMutation && methods.end >= characterOfMutation)[0];
        if (methodBounds === void 0) {
            return {pos: characterOfMutation - 5, end: characterOfMutation + 10};
        } else {
            return methodBounds;
        }
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
