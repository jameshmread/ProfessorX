import { IMutatableNode } from "../../interfaces/IMutatableNode";

import { OutputStore } from "../../DTOs/OutputStore";
import { SourceObject } from "../../DTOs/SourceObject";
import { FileObject } from "../../DTOs/FileObject";
import { MAttemptFail } from "../../DTOs/MAttemptFail";

import { MutationFactory } from "../mutationFactory/MutationFactory";
import { OutputStoreManager } from "../output/OutputStoreManager";
import { ConfigManager } from "../configManager/ConfigManager";
import { SourceCodeHandler } from "../SourceCodeHandler/SourceCodeHandler";
import { Cleaner } from "../cleanup/Cleaner";
import { FileHandler } from "../FileHandler/FileHandler";
import { MochaTestRunner } from "../mocha-testRunner/Mocha-TestRunner";
import { Worker } from "../Worker";

export class MultipleNodeMutator {
      private outputStoreManager: OutputStoreManager;
      private mochaRunner: MochaTestRunner;
      private sourceCodeHandler: SourceCodeHandler;
      private fileHandler: FileHandler;
      private currentNode: IMutatableNode;
      private srcFile: string;
      private testFile: string;
      private errorString: string;

      constructor () {
            const configManager = new ConfigManager();
            this.outputStoreManager = new OutputStoreManager();
      }

      public setCurrentNode (node: IMutatableNode) {
            this.currentNode = node;
      }

      public async mutateSingleNode () {
            const mutationOptions = MutationFactory.getMultipleMutations(this.currentNode.syntaxType);
            for (let i = 0; i < mutationOptions.length; i++) {
                  await this.doSingleMutation(mutationOptions[i]);
            }
            Worker.workerResults.push(OutputStoreManager.outputStoreList);
      }

      private async doSingleMutation (mutationOption: string) {
            this.outputStoreManager.setCurrentOutputStore(
                  new OutputStore(ConfigManager.filePath, this.currentNode.parentFileName)
            );
            this.setFileInformation();
            if (!this.createSourceCodeHandler()) {
                  this.outputStoreManager.getCurrentOutputStore().mutationAttemptFailure =
                  new MAttemptFail(
                        this.errorString,
                        this.currentNode.syntaxType.toString() + " => " +
                        mutationOption,
                        this.currentNode
                  );
                  return;
            }
            this.setSourceCodeInformation(mutationOption);
            this.createMutatedFiles();
            this.outputStoreManager.configureStoreData(this.testFile, this.currentNode, this.sourceCodeHandler);
            this.mochaRunner = new MochaTestRunner(ConfigManager.runnerConfig);
            await this.mochaRunner.runTests(this.outputStoreManager, this.testFile);
            this.outputStoreManager.addStoreToList();
            this.cleanFiles();
      }

      private setFileInformation () {
            const fileObject = new FileObject(this.currentNode.parentFileName);
            fileObject.coreNumber = process.pid;
            this.fileHandler = new FileHandler(fileObject);
      }

      private createSourceCodeHandler (): boolean {
            try {
                  this.sourceCodeHandler = new SourceCodeHandler(new SourceObject(this.fileHandler.getSourceObject()));
                  return true;
            }catch (error) {
                  this.errorString = "Could not create source code handler: " + error;
                  console.log(this.errorString);
                  return false;
            }
      }

      private setSourceCodeInformation (mutationOptions: string) {
            this.sourceCodeHandler.resetModified();
            this.sourceCodeHandler.modifyCode(this.currentNode, mutationOptions);
      }

      private createMutatedFiles () {
            this.srcFile = this.fileHandler.writeTempSourceModifiedFile(
                  this.sourceCodeHandler.getModifiedSourceCode());
            this.testFile = this.fileHandler.createTempTestModifiedFile();
      }

      private cleanFiles () {
            Cleaner.deleteTestFile(this.testFile);
            Cleaner.deleteSourceFile(this.srcFile);
      }
}
