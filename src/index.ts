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

var startTimestamp = new Date().getTime();

console.log(startTimestamp);
const config = new ConfigManager();
let  outputStore: OutputStore;
const testFileHandler = new TestFileHandler(config.filePath);
const fileHandler = new FileHandler(config.filePath, config.fileToMutate);
const sourceObj = new SourceCodeHandler(fileHandler.getSourceObject());
const codeInspector = new CodeInspector(fileHandler.getSourceObject());
const nodes = codeInspector.findObjectsOfSyntaxKind(ts.SyntaxKind.PlusToken);
const cleaner = new Cleaner(config.filePath);

for (const sampleNode of nodes) {
    outputStore = new OutputStore();
    //resets modified code after a mutation
    sourceObj.resetModified();
    //performs the modification at a specific position
    sourceObj.modifyCode(sampleNode.pos, sampleNode.end, MutationFactory.getSingleMutation(ts.SyntaxKind.PlusToken));
    //writes this change to a NEW src file
    fileHandler.writeTempSourceModifiedFile(sourceObj.getModifiedSourceCode());
    //creates a new test file with a reference to the NEW source file
    const testFile = fileHandler.createTempTestModifiedFile();

    outputStore.setTestFile(testFile);
    outputStore.setLineNumber(
        ts.getLineAndCharacterOfPosition(
            sourceObj.getOriginalSourceObject(), sampleNode.pos).line);

    outputStore.setOrigionalSourceCode(sourceObj.getOriginalSourceCode());
    outputStore.setModifiedSourceCode(sourceObj.getModifiedSourceCode());

    const mochaRunner = new MochaTestRunner([testFile], config.runnerConfig);
    mochaRunner.addFiles();
    mochaRunner.run(finishRun, outputStore);
}


function finishRun (testFileNames: Array<string>) {

    console.log("-----------------------------------------");
    cleaner.deleteTestFile(testFileNames[0]);
    console.log("File being deleted", testFileNames[0]);
    // cleaner.deleteMutatedFiles(cleaner.findMutatedFiles());
    //^^ this tries to delete EVERY file after each test, obviously bad
}

let endTimestamp = new Date().getTime();
let difference = new Date(endTimestamp - startTimestamp).getTime();
console.log("difference", difference);