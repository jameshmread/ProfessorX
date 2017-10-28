import * as ts from "typescript";
import * as Mocha from "mocha";

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
    public outputStores: Array<OutputStore>;
    public testFileHandler;
    public fileHandler;
    public sourceObj;
    public codeInspector;
    public nodes;
    public cleaner;
    public mochaRunner;

    public constructor () {
        this.startTimestamp = new Date().getTime();
        this.outputStores = new Array<OutputStore>();
        this.config = new ConfigManager();
        this.testFileHandler = new TestFileHandler(this.config.filePath);
        this.fileHandler = new FileHandler(this.config.filePath, this.config.fileToMutate);
        this.sourceObj = new SourceCodeHandler(this.fileHandler.getSourceObject());
        this.codeInspector = new CodeInspector(this.fileHandler.getSourceObject());
        this.nodes = this.codeInspector.findObjectsOfSyntaxKind(ts.SyntaxKind.PlusToken);
        this.cleaner = new Cleaner(this.config.filePath);
    }

    public async main () {
        // will be mutateFiles -> mutateNodesInsideFiles
        await this.mutateNodes();
        console.log("outputstore array", this.outputStores);
        this.finishRun(this.outputStores);
    }

    /* I do want to separate this function up even more
        but for now it would reduce debugging time to leave it as one
    */
    public async mutateNodes () {
        for (const sampleNode of this.nodes) {
            this.outputStore = new OutputStore(
                this.config.filePath,
                this.config.fileToMutate,
                this.config.testRunner,
                this.config.runnerConfig
            );
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
            // dont need to create a test runner object every time probably (unless this allows for parallel running)

            await this.testRunner();
            this.cleaner.deleteTestFile(testFile);
        }
    }


    public finishRun (outputStores) {
        const endTimestamp = new Date().getTime();
        const difference = new Date(endTimestamp - this.startTimestamp).getTime();
        OutputStore.writeOutputStoreToJson(outputStores);
        OutputStore.writeDataToJson(OutputStore.setRunTime(difference));
    }

    private async testRunner () {
        this.mochaRunner.addFiles();
        const promise = await this.mochaRunner.runTests(this.outputStore);
        this.outputStores.push(promise);
    }
}
const x = new ProfessorX();
x.main();
