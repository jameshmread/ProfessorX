import * as ts from "typescript";
import * as Mocha from "mocha";

import { FileHandler } from "./FileHandler/FileHandler";
import { CodeInspector } from "./CodeInspector/CodeInspector";
import { SourceCodeHandler } from "./SourceCodeHandler/SourceCodeHandler";
import { MutationFactory } from "./mutationFactory/MutationFactory";
import { MochaTestRunner } from "./mocha-testRunner/Mocha-TestRunner";
import { ConfigManager } from "./configManager/ConfigManager";
import { OutputStore } from "./output/OutputStore";
import { Cleaner } from "./cleanup/Cleaner";
import { ITestResult } from "../interfaces/ITestResult";
import { Printer } from "./output/printer/Printer";
import { IMutatableNode } from "../interfaces/IMutatableNode";

export class ProfessorX {

    public startTimestamp;
    public config: ConfigManager;
    public outputStore: OutputStore;
    public outputStores: Array<OutputStore>;
    public fileHandler: FileHandler;
    public sourceObj: SourceCodeHandler;
    public codeInspector: CodeInspector;
    public nodes: Array<IMutatableNode> = new Array<IMutatableNode>();
    public cleaner: Cleaner;
    public mochaRunner;

    public constructor () {
        this.startTimestamp = new Date().getTime();
        this.outputStores = new Array<OutputStore>();
        this.config = new ConfigManager();
        this.fileHandler = new FileHandler(this.config.filePath, this.config.fileToMutate);
        this.sourceObj = new SourceCodeHandler(this.fileHandler.getSourceObject());

        // this will need to be given a new source object for every file
        this.codeInspector = new CodeInspector(this.fileHandler.getSourceObject());

        this.cleaner = new Cleaner(this.config.filePath);
    }

    public async main () {
        // will be mutateFiles -> mutateNodesInsideFiles
        this.getAllNodes();
        await this.mutateAllNodeTypes();
        this.finishRun(this.outputStores);
        this.cleaner.deleteMutatedFiles(this.cleaner.findMutatedFiles());
    }

    public async mutateAllNodeTypes () {
        for (const currentNode of this.nodes) {
            await this.mutateAllNodesOfType(currentNode);
        }
    }

    public async mutateAllNodesOfType (currentNode: IMutatableNode) {
        const mutationOptions = MutationFactory.getMultipleMutations(currentNode.syntaxType);
        for (let i = 0; i < currentNode.positions.length; i++) {
            for (let j = 0; j < mutationOptions.length; j++){
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
                    currentNode.positions[i]["pos"],
                    currentNode.positions[i]["end"],
                    mutationOptions[j]
                );
                // writes this change to a NEW src file
                this.fileHandler.writeTempSourceModifiedFile(this.sourceObj.getModifiedSourceCode());
                // creates a new test file with a reference to the NEW source file
                const testFile = this.fileHandler.createTempTestModifiedFile();

                this.setOutputStoreInfo(testFile, currentNode, i);

                this.mochaRunner = new MochaTestRunner([testFile], this.config.runnerConfig);
                // dont need to create a test runner object every time probably
                // (unless this allows for parallel running)

                await this.testRunner();
                // dont like how im deleting and re creating the test file for every node
                this.cleaner.deleteTestFile(testFile);
            }
        }
    }

    private setOutputStoreInfo (testFile: string, currentNode: IMutatableNode, i: number) {
        this.outputStore.setTestFile(testFile);

        this.outputStore.setLineNumber(
            ts.getLineAndCharacterOfPosition(
                this.sourceObj.getOriginalSourceObject(),
                currentNode.positions[i]["pos"]).line
        );
        this.outputStore.setOrigionalSourceCode(this.sourceObj.getOriginalSourceCode());
        this.outputStore.setModifiedSourceCode(this.sourceObj.getModifiedSourceCode());
    }

    private getAllNodes () {
        MutationFactory.mutatableTokens.forEach((syntaxItem) => {
            this.nodes.push({
                syntaxType : syntaxItem,
                positions : this.codeInspector.findObjectsOfSyntaxKind(syntaxItem)
            });
        });
    }

    private finishRun (outputStores) {
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
