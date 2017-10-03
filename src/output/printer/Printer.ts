import { OutputStore } from "../OutputStore";

export class Printer {

    public readonly LABELS = {
        returnToken: "\n",
        doubleSpaceToken: "  ",
        filePath: "File Path: ",
        lineNumber: "On Line #: ",
        originalSource: "~~~~~~ Source Code Changes ~~~~~~",
        removeToken: " -- ",
        mutatedSource: "~~~~~~ Mutated Source Code ~~~~~~",
        addToken: " ++ ",
        testResults: "~~~~~~ Test Results ~~~~~~",
        passedTests: "Tests Passed (Survived Mutants)",
        failedTests: "Tests Failed (Killed Mutants)",
        mutationScore: "Mutation Score: ",
        endSourceChanges: "~~~ End of Source Code Changes ~~~",
        percentage: " %"
    };
    private readonly LEADING_EDGE = "~~~~~~~~~~ Professor X ~~~~~~~~~~";

    constructor (private outputStore: OutputStore) {
    }

    public printSourceChanges () {
        console.log(this.combineSourceChanges());
    }

    public combineSourceChanges (): string {
        return this.LABELS.returnToken
        + this.LEADING_EDGE
        + this.LABELS.returnToken
        + this.buildSourceFilePath()
        + this.LABELS.returnToken
        + this.LABELS.originalSource
        + this.LABELS.returnToken
        + this.buildOrigionalCode()
        + this.LABELS.returnToken
        + this.buildMutatedCode()
        + this.LABELS.returnToken
        + this.LABELS.returnToken
        + this.LABELS.endSourceChanges
        + this.LABELS.returnToken
        + this.LABELS.returnToken
        + this.buildPassedTests()
        + this.LABELS.returnToken
        + this.buildFailedTests()
        + this.LABELS.returnToken
        + this.buildMutationScore()
        ;
    }

    private buildSourceFilePath (): string {
        let sourceFilePath = "";
        sourceFilePath =  this.LABELS.returnToken + this.LABELS.filePath;
        sourceFilePath += this.LABELS.returnToken;
        sourceFilePath += this.outputStore.testFilePath;
        return sourceFilePath;
    }

    private buildOrigionalCode (): string {
        return this.LABELS.returnToken
        + this.LABELS.lineNumber
        + this.outputStore.lineNumber
        + this.LABELS.doubleSpaceToken
        + this.outputStore.origionalCode
        + this.LABELS.removeToken
        + this.LABELS.returnToken;
    }

    private buildMutatedCode (): string {
        return this.LABELS.mutatedSource
        + this.LABELS.returnToken
        + this.LABELS.lineNumber
        + this.outputStore.lineNumber
        + this.LABELS.doubleSpaceToken
        + this.outputStore.mutatedCode
        + this.LABELS.addToken
        + this.LABELS.returnToken;
    }

    private buildPassedTests (): string {
        return this.LABELS.testResults
        + this.LABELS.returnToken
        + this.LABELS.passedTests
        + ": "
        + this.outputStore.numberOfPassedTests
        + this.LABELS.returnToken;
    }

    private buildFailedTests (): string {
        return this.LABELS.failedTests
        + ": "
        + this.outputStore.numberOfFailedTests
        + this.LABELS.returnToken;
    }

    private buildMutationScore (): string {
        return this.LABELS.mutationScore
        + this.LABELS.doubleSpaceToken
        + this.outputStore.mutationScore
        + this.LABELS.percentage
        + this.LABELS.returnToken
        ;
    }

    private createLeadingPrintEdge () {
        console.log(this.LEADING_EDGE);
    }
}
