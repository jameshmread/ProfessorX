import { IMutatableNode } from "../../interfaces/IMutatableNode";

import { OutputStore } from "../../DTOs/OutputStore";
import { SourceObject } from "../../DTOs/SourceObject";
import { FileObject } from "../../DTOs/FileObject";

import { MutationFactory } from "../mutationFactory/MutationFactory";
import { OutputStoreManager } from "../output/OutputStoreManager";
import { ConfigManager } from "../configManager/ConfigManager";
import { SourceCodeHandler } from "../SourceCodeHandler/SourceCodeHandler";
import { Cleaner } from "../cleanup/Cleaner";
import { FileHandler } from "../FileHandler/FileHandler";
import { MochaTestRunner } from "../mocha-testRunner/Mocha-TestRunner";
import { Worker } from "../Worker";

export class MultipleNodeHandler {
      private outputStoreManager: OutputStoreManager;
      private mochaRunner: MochaTestRunner;
      private sourceCodeHandler: SourceCodeHandler;
      private fileHandler: FileHandler;
      constructor () {
            const configManager = new ConfigManager();
            this.outputStoreManager = new OutputStoreManager();
      }

      public async mutateSingleNode (currentNode: IMutatableNode) {
            const mutationOptions = MutationFactory.getMultipleMutations(currentNode.syntaxType);
            for (let j = 0; j < mutationOptions.length; j++) {
                  this.outputStoreManager.setCurrentOutputStore(
                        new OutputStore(ConfigManager.filePath, currentNode.parentFileName)
                  ); // file path can be calculated
                  const fo = new FileObject(ConfigManager.filePath, currentNode.parentFileName);
                  fo.coreNumber = process.pid;
                  this.fileHandler = new FileHandler(fo);
                  const fh = new FileHandler(fo);
                  this.sourceCodeHandler = new SourceCodeHandler(new SourceObject(fh.getSourceObject()));

                  this.sourceCodeHandler.resetModified(); // resets modified code after a mutation
                  this.sourceCodeHandler.modifyCode(
                        currentNode.positions["pos"],
                        currentNode.positions["end"],
                        mutationOptions[j]
                  ); // performs the modification at a specific position

                  // writes this change to a NEW src file
                  const srcFile = this.fileHandler.writeTempSourceModifiedFile(
                        this.sourceCodeHandler.getModifiedSourceCode());
                  // creates a new test file with a reference to the NEW source file
                  const testFile = this.fileHandler.createTempTestModifiedFile();

                  this.outputStoreManager.configureStoreData(testFile, currentNode, this.sourceCodeHandler);
                  this.mochaRunner = new MochaTestRunner(ConfigManager.runnerConfig);
                  await this.mochaRunner.runTests(this.outputStoreManager, testFile);
                  // dont like how im deleting and re creating the test file for every node
                  this.outputStoreManager.addStoreToList();
                  Cleaner.deleteTestFile(testFile);
                  Cleaner.deleteSourceFile(srcFile);
            }
            Worker.workerResults.push(OutputStoreManager.outputStoreList);
      }
}
