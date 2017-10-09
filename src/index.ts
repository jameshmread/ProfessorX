import * as ts from "typescript";
import * as Mocha from "mocha";
import * as moment from "moment";

import { FileHandler } from "./FileHandler/FileHandler";
import { CodeInspector } from "./CodeInspector/CodeInspector";
import { SourceCodeHandler } from "./SourceCodeHandler/SourceCodeHandler";
import { MutationFactory } from "./mutationFactory/MutationFactory";
import { MochaTestRunner } from "./mocha-testRunner/Mocha-TestRunner";
import { ConfigManager } from "./configManager/ConfigManager";
import { TestFileHandler } from "./testFileHandler/TestFileHandler";
import { OutputStore } from "./output/OutputStore";
import { Cleaner } from "./cleanup/Cleaner";
import { ITestResult } from "../interfaces/ITestResult";
import { Printer } from "./output/printer/Printer";

export class ProfessorX {

    public startTimestamp = new Date().getTime();
    public config;
    public outputStore: OutputStore;
    // possibly use array of output stores?
    public testFileHandler;
    public fileHandler;
    public sourceObj;
    public codeInspector;
    public nodes;
    public cleaner;
    public mochaRunner;

    public constructor () {
        this.startTimestamp = new Date().getTime();
        this.config = new ConfigManager();
        this.testFileHandler = new TestFileHandler(this.config.filePath);
        this.fileHandler = new FileHandler(this.config.filePath, this.config.fileToMutate);
        this.sourceObj = new SourceCodeHandler(this.fileHandler.getSourceObject());
        this.codeInspector = new CodeInspector(this.fileHandler.getSourceObject());
        this.nodes = this.codeInspector.findObjectsOfSyntaxKind(ts.SyntaxKind.PlusToken);
        this.cleaner = new Cleaner(this.config.filePath);
    }

    public async main () {
        this.mutateNodes();
    }

    /* I do want to separate this function up even more
        but for now it would reduce debugging time to leave it as one
    */
    public mutateNodes () {
        for (const sampleNode of this.nodes) {
            this.outputStore = new OutputStore();
            // resets modified code after a mutation
            this.sourceObj.resetModified();
            // performs the modification at a specific position
            this.sourceObj.modifyCode(
                                    sampleNode.pos,
                                    sampleNode.end,
                                    MutationFactory.getSingleMutation(ts.SyntaxKind.PlusToken)
                                );
            // writes this change to a NEW src file
            this.fileHandler.writeTempSourceModifiedFile(this.sourceObj.getModifiedSourceCode());
            // creates a new test file with a reference to the NEW source file
            const testFile = this.fileHandler.createTempTestModifiedFile();

            this.outputStore.setTestFile(testFile);
            this.outputStore.setLineNumber(
                ts.getLineAndCharacterOfPosition(
                    this.sourceObj.getOriginalSourceObject(), sampleNode.pos).line);

            this.outputStore.setOrigionalSourceCode(this.sourceObj.getOriginalSourceCode());
            this.outputStore.setModifiedSourceCode(this.sourceObj.getModifiedSourceCode());

            this.mochaRunner = new MochaTestRunner([testFile], this.config.runnerConfig);
            this.testRunner();
            this.cleaner.deleteTestFile(testFile);
        }
        this.finishRun();
    }

    public async testRunner () {
        this.mochaRunner.addFiles();
        this.outputStore = await this.mochaRunner.runTests(this.outputStore);
        console.log("after run", this.outputStore);
    }

    public finishRun () {
        const endTimestamp = new Date().getTime();
        const difference = new Date(endTimestamp - this.startTimestamp).getTime();
        console.log("Time Taken to Mutate:", difference);
    }

}
const x = new ProfessorX();
x.main();
